import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
// 模型统一存放在 public/models/tractor.glb（与 /api/model/tractor 同一份文件）
const modelUrl = '/models/tractor.glb';

interface TractorModelProps {
  onLoaded?: (object: THREE.Object3D) => void;
}

// 允许保留的标准 three.js 节点类型
const KEEP_TYPES = new Set([
  'Scene',
  'Group',
  'Object3D',
  'Mesh',
  'SkinnedMesh',
  'Bone',
  'Line',
  'LineSegments',
  'Points',
  'Sprite',
  'InstancedMesh',
]);

/**
 * 拖拉机 3D 模型组件
 * - 使用 @react-three/drei 的 useGLTF 加载 GLB 模型
 * - 模型通过 import 引入（?url），由 Vite 打包
 * - 加载后清理非标准节点（如 Sketchfab 模型中的 Svg 扩展节点），
 *   避免 R3F 对未知类型节点做命名空间校验时报错
 */
export default function TractorModel({ onLoaded }: TractorModelProps) {
  const { scene } = useGLTF(modelUrl);

  // 清理场景：移除非标准节点，避免 R3F 校验报错
  const cleanedScene = useMemo(() => {
    const removals: THREE.Object3D[] = [];
    scene.traverse((child) => {
      const type = (child as { type?: string }).type || '';
      if (!KEEP_TYPES.has(type)) {
        removals.push(child);
      }
    });
    removals.forEach((node) => {
      if (node.parent) {
        node.parent.remove(node);
      }
    });
    return scene;
  }, [scene]);

  useEffect(() => {
    // 模型加载完成回调，把场景对象传出去供外层做相机 fit
    if (cleanedScene && onLoaded) {
      // 延迟一帧确保缩放/居中完成、首次渲染就绪
      requestAnimationFrame(() => onLoaded(cleanedScene));
    }
  }, [cleanedScene, onLoaded]);

  useEffect(() => {
    // 遍历场景，开启阴影投射与接收，调整材质 PBR 参数
    cleanedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = Math.min(mat.roughness, 0.85);
              mat.metalness = Math.max(mat.metalness, 0.1);
              mat.envMapIntensity = 0.8;
            }
          });
        }
      }
    });
  }, [cleanedScene]);

  // 计算模型包围盒，居中并调整到地面
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(cleanedScene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // 计算最大边长用于缩放（目标尺寸约 2.5 单位）
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.5 / maxDim;

    // 居中 + 贴地
    cleanedScene.position.x = -center.x * scale;
    cleanedScene.position.z = -center.z * scale;
    cleanedScene.position.y = -box.min.y * scale - 0.4; // 贴到网格地面（网格在 y=-0.4）

    cleanedScene.scale.setScalar(scale);
  }, [cleanedScene]);

  return <primitive object={cleanedScene} />;
}

// 预加载模型
useGLTF.preload(modelUrl);
