import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

// 模型统一存放在 public/models/tractor.glb，前端唯一引用路径
const MODEL_URL = '/models/tractor.glb';

interface TractorModelProps {
  onLoaded?: (object: THREE.Object3D) => void;
}

/**
 * 拖拉机 3D 模型组件
 *
 * - 统一加载 public/models/tractor.glb（通过 Vite 静态资源服务 /models/tractor.glb）
 * - 从 useGLTF 缓存中克隆 scene（包含 SkinnedMesh/Bone 时使用 SkeletonUtils.clone），
 *   所有缩放、居中、贴地、材质修改只作用于克隆体，绝不修改 useGLTF 缓存的原 scene，
 *   避免组件重新挂载时在上一次修改过的缓存 scene 上重复缩放/定位导致尺寸漂移
 * - 归一化顺序：先 updateMatrixWorld(true)，按原始包围盒计算缩放，
 *   再 updateMatrixWorld(true) 后按最终 scale 重新计算 Box3，做水平居中 + 贴地
 * - 不对模型做节点白名单过滤，完整保留 GLB 原始结构
 */
export default function TractorModel({ onLoaded }: TractorModelProps) {
  // useGLTF 返回的是全局缓存的原始 scene，绝不可直接修改
  const { scene } = useGLTF(MODEL_URL);

  // 从缓存 scene 克隆一份独立副本，后续所有修改只作用于克隆体
  const model = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene) as THREE.Scene;
    return cloned;
  }, [scene]);

  // 归一化：居中、缩放、贴地（只作用于克隆体，每次挂载结果一致）
  useEffect(() => {
    if (!model) return;

    // 强制重置缩放：useGLTF 全局缓存 scene 可能被历史挂载污染（继承旧缩放），
    // 必须先归一到 1 再基于原始包围盒计算，否则 scale 会算成 1 导致模型不缩放
    model.scale.setScalar(1);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (!maxDim) return;

    // 目标最大边长 2.5 单位，适配 HeroSection 4:3 容器
    const scale = 2.5 / maxDim;
    model.scale.setScalar(scale);

    // scale 确定后重新计算最终 Box3（保证 Box3 在最终 scale 之后计算）
    model.updateMatrixWorld(true);
    const finalBox = new THREE.Box3().setFromObject(model);
    const finalCenter = finalBox.getCenter(new THREE.Vector3());
    const finalMin = finalBox.min.clone();

    // 水平居中 + 贴地（地面网格位于 y=-0.4）
    model.position.set(-finalCenter.x, -finalMin.y - 0.4, -finalCenter.z);
    model.updateMatrixWorld(true);

    // 最终尺寸/位置确定后，通知外层做相机 fit（只回调一次）
    onLoaded?.(model);
  }, [model, onLoaded]);

  // 材质与阴影处理（克隆体）
  useEffect(() => {
    if (!model) return;
    model.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.roughness = Math.min(mat.roughness, 0.85);
            mat.metalness = Math.max(mat.metalness, 0.1);
            mat.envMapIntensity = 0.8;
          }
        });
      }
    });
  }, [model]);

  if (!model) return null;

  return <primitive object={model} />;
}
