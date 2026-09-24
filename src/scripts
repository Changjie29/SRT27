$ErrorActionPreference = 'Stop'

# 在 SRT27 根目录执行：
# powershell -ExecutionPolicy Bypass -File .\scripts\import_tractor_resources.ps1

$repo = Split-Path -Parent $PSScriptRoot
$external = Join-Path $repo 'server\resources\external'
New-Item -ItemType Directory -Force -Path $external | Out-Null

function Sync-SparseRepo($url, $name, $branch, $paths) {
  $target = Join-Path $external $name
  if (Test-Path $target) {
    Write-Host "Updating $name ..."
    git -C $target pull --ff-only
    return
  }

  $tmp = Join-Path $env:TEMP ("srt27_" + [IO.Path]::GetRandomFileName())
  New-Item -ItemType Directory -Force -Path $tmp | Out-Null
  try {
    git clone --filter=blob:none --no-checkout --depth 1 --branch $branch $url $tmp
    git -C $tmp sparse-checkout init --cone
    git -C $tmp sparse-checkout set $paths
    git -C $tmp checkout
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    Copy-Item -Recurse -Force (Join-Path $tmp '*') $target
  }
  finally {
    Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue
  }
}

# MIT：拖拉机模型 + URDF/仿真相关文件
Sync-SparseRepo `
  'https://github.com/ros-agriculture/lawn_tractor.git' `
  'ros-agriculture-lawn_tractor' `
  'master' `
  @('LICENSE','README.md','lawn_tractor_sim/meshes','lawn_tractor_sim/urdf','lawn_tractor_sim/maps','lawn_tractor_sim/stage')

# Apache-2.0：GPS + IMU 定位参数/示例
Sync-SparseRepo `
  'https://github.com/ros-agriculture/tractor_localization.git' `
  'ros-agriculture-tractor_localization' `
  'master' `
  @('LICENSE','README.md','params','launch','package.xml','CMakeLists.txt')

# BSD-3-Clause：系统级拖拉机仿真参考
Sync-SparseRepo `
  'https://github.com/simscape/Tractor-Simscape.git' `
  'tractor-simscape-reference' `
  'main' `
  @('License.txt','README.md','Component','Model','Overview','Scripts','Test','Workflow','resources/project')

Write-Host ''
Write-Host 'Import completed.' -ForegroundColor Green
Write-Host '注意：第三方仓库仍需遵守其许可证；数据集不要因为仓库公开就直接重新分发。'
