# ================================
# 多阶段构建：基于 manylinux2014 (glibc 2.17+) + Miniforge
# ================================
FROM quay.io/pypa/manylinux2014_x86_64 AS builder

# 设置工作目录
WORKDIR /app

# 传递构建参数
ARG GOOS=linux
ARG GOARCH=amd64

# 检查是否正确传参
RUN echo "🏗 Building for $GOOS/$GOARCH"

# -------------------------------
# 安装 Miniforge
# -------------------------------
ENV MAMBA_ROOT_PREFIX=/opt/conda
ENV PATH=/opt/conda/bin:${PATH}

RUN curl -L -o miniforge.sh https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh && \
    bash miniforge.sh -b -p /opt/conda && \
    rm miniforge.sh && \
    conda clean --all

# 接受许可并创建环境
RUN conda init bash && \
    echo "conda activate base" >> ~/.bashrc && \
    conda create -n py313 python=3.13 -y && \
    /opt/conda/envs/py313/bin/pip install pyinstaller

# 激活 py313 环境为默认
ENV CONDA_DEFAULT_ENV=py313
ENV PATH=/opt/conda/envs/py313/bin:$PATH

# -------------------------------
# 复制源码 & 安装依赖
# -------------------------------
# ❗ 修改点：不再 COPY parser-Python，而是直接复制 . 到 /app
COPY . .

RUN pip install -r requirements.txt

# -------------------------------
# 使用 PyInstaller 打包
# -------------------------------
RUN pyinstaller --onefile uast/builder.py

# ===============================
# 第二阶段：精简镜像
# ===============================
FROM quay.io/pypa/manylinux2014_x86_64

WORKDIR /dist

# 从 builder 阶段复制打包好的可执行文件
COPY --from=builder /app/dist/builder ./uast4py-linux-amd64

# 添加可执行权限
RUN chmod +x uast4py-linux-amd64

# 提示构建完成（可替换为实际命令）
CMD ["echo", "✅ Build complete! Binary: /dist/uast4py-linux-amd64"]
