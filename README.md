# ratcode

# 怼联

此项目主要参考了两项文档：[https://github.com/microsoft/ai-edu/tree/master/B-教学案例与实践/B13-AI对联生成案例](https://github.com/microsoft/ai-edu/tree/master/B-%E6%95%99%E5%AD%A6%E6%A1%88%E4%BE%8B%E4%B8%8E%E5%AE%9E%E8%B7%B5/B13-AI%E5%AF%B9%E8%81%94%E7%94%9F%E6%88%90%E6%A1%88%E4%BE%8B)和[小程序实现仿微信聊天界面](https://www.jb51.net/article/156415.htm)。

更多nlp数据训练的详细内容可以点击[https://github.com/microsoft/ai-edu/tree/master/B-教学案例与实践/B13-AI对联生成案例](https://github.com/microsoft/ai-edu/tree/master/B-%E6%95%99%E5%AD%A6%E6%A1%88%E4%BE%8B%E4%B8%8E%E5%AE%9E%E8%B7%B5/B13-AI%E5%AF%B9%E8%81%94%E7%94%9F%E6%88%90%E6%A1%88%E4%BE%8B)进行了解，这里仅对这个项目进行说明，下面是这个项目的框架：

![webServer.jpg](https://upload-images.jianshu.io/upload_images/2298266-b648586e7753f689.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

up2down_model是我们训练好的模型，用tensorflow-serving-api包装成了一个api供web服务调用，web后端是flask应用，web前端是小程序。

环境与工具
本案例运行在腾讯云虚拟机上，虚拟机的系统为Ubuntu 18.04

需要的软件环境如下：

- Python 3.5.9
- tensorflow 1.14.0
- tensor2tensor 1.14.1

项目的目录结构如下：

![image.png](https://upload-images.jianshu.io/upload_images/2298266-a0aa0aab79ba77e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
data \ 训练模型后的最终数据
  checkpoint
  model.ckpt-26675.data-00000-of-00002
  model.ckpt-26675.data-00001-of-00002
  model.ckpt-26675.index
  model.ckpt-26675.meta
data_dir \ 用于训练模型的数据
  merge.txt.vocab.clean
  train.txt.down.clean
  train.txt.up.clean
duiCouplet \ 小程序代码
  app.js
  app.json
  app.wxss
  images/
  pages/
  project.config.json
  sitemap.json
  utils/
output \ 训练模型后的最终数据
  checkpoint
  model.ckpt-200000.data-00000-of-00002
  model.ckpt-200000.data-00001-of-00002
  model.ckpt-200000.index
  model.ckpt-200000.meta
up2down_model \ 包装模型的api代码
  data/
  output/
  up2down_model.py
usr_dir \ 生成训练数据的代码
    __init__.py
    merge_vocab.py
```

## 部署环境

### 申请免费云服务器虚拟机

在[腾讯云上](https://cloud.tencent.com/act)注册，申请新用户试用一个月的服务器，虚拟机的系统选择Ubuntu 18.04，这里可能需要设置一下子网网段，注意要在服务器的可用区设置子网，因为我这已经设置过了，等你设置的时候，就能明白我说的什么意思了。

![image.png](https://upload-images.jianshu.io/upload_images/2298266-cbe5ea2b880720b4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

[使用标准登录方式登录 Linux 实例](https://cloud.tencent.com/document/product/213/5436)里，有登录云服务虚拟机的方法，按里面说的操作步骤来登录。

### 安装python环境

登录之后，系统自带的python环境是2.7，因为这个是系统自带的python，我们最好不要用，用出问题了，系统就会出问题，所以先安装pyenv，用它来管理多版本python。

- pyenv:

[https://github.com/pyenv/pyenv](https://github.com/pyenv/pyenv),官方文档给出的安装步骤，依次输入下面指令:

```
git clone https://github.com/pyenv/pyenv.git ~/.pyenv

echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.bashrc

exec "$SHELL"
```

装完可以用“pyenv”检测一下，是否安装成功。

```
ubuntu@VM-0-4-ubuntu:~$ pyenv
pyenv 1.2.16
Usage: pyenv <command> [<args>]

Some useful pyenv commands are:
   commands    List all available pyenv commands
   activate    Activate virtual environment
   commands    List all available pyenv commands
   deactivate   Deactivate virtual environment
   exec        Run an executable with the selected Python version
   global      Set or show the global Python version
   help        Display help for a command
   hooks       List hook scripts for a given pyenv command
   init        Configure the shell environment for pyenv
   install     Install a Python version using python-build
   local       Set or show the local application-specific Python version
   prefix      Display prefix for a Python version
   rehash      Rehash pyenv shims (run this after installing executables)
   root        Display the root directory where versions and shims are kept
   shell       Set or show the shell-specific Python version
   shims       List existing pyenv shims
   uninstall   Uninstall a specific Python version
   version     Show the current Python version and its origin
   --version   Display the version of pyenv
   version-file   Detect the file that sets the current pyenv version
   version-name   Show the current Python version
   version-origin   Explain how the current Python version is set
   versions    List all Python versions available to pyenv
   virtualenv   Create a Python virtualenv using the pyenv-virtualenv plugin
   virtualenv-delete   Uninstall a specific Python virtualenv
   virtualenv-init   Configure the shell environment for pyenv-virtualenv
   virtualenv-prefix   Display real_prefix for a Python virtualenv version
   virtualenvs   List all Python virtualenvs found in `$PYENV_ROOT/versions/*'.
   whence      List all Python versions that contain the given executable
   which       Display the full path to an executable

See `pyenv help <command>' for information on a specific command.
For full documentation, see: https://github.com/pyenv/pyenv#readme

```

- 安装新的Python版本:

先安装构建Python的系统依赖项。从 [pyenv维基](https://github.com/pyenv/pyenv/wiki)找到在ubuntu中的依赖安装命令：

```
sudo apt-get update; sudo apt-get install --no-install-recommends make build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
```

用pyenv安装python3.5.9:

```
pyenv install 3.5.9
```

安装[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv)插件：

```
git clone https://github.com/yyuu/pyenv-virtualenv.git ~/.pyenv/plugins/pyenv-virtualenv

echo 'eval "$(pyenv virtualenv-init -)"' >> ~/.bashrc

exec "$SHELL"
```

用pyenv-virtualenv更换运行时版本：

```
pyenv virtualenv 3.5.9 359rat
pyenv local 359rat
```

将数据和代码克隆在虚拟机中：

```
git clone https://github.com/SunshineHope/ratcode.git
```

### 安装模型训练环境

此时数据和代码都在ratcode中，输入“ls”可以看到ratcode，需要进入到ratcode文件夹内，安装模型需要的包：

```
cd ratcode

pip install -r train_requirements.txt
```

训练所需 python packages 在文件 train_requirements.txt 中，安装可能需要等一段时间，安装好后，就可以进行模型训练了。

## 生成模型

### 数据预处理

训练模型所需的数据是train.txt.up、train.txt.down，具体操作可以看[数据预处理](https://github.com/microsoft/ai-edu/tree/master/B-%E6%95%99%E5%AD%A6%E6%A1%88%E4%BE%8B%E4%B8%8E%E5%AE%9E%E8%B7%B5/B13-AI%E5%AF%B9%E8%81%94%E7%94%9F%E6%88%90%E6%A1%88%E4%BE%8B#%E6%95%B0%E6%8D%AE%E9%A2%84%E5%A4%84%E7%90%86)，不再赘述。

### 模型训练

有了处理好的数据，我们就可以进行训练了。你可以选择本地训练或在OpenPAI上训练。原教程里给的是[在OpenPAI上训练](https://github.com/microsoft/ai-edu/blob/master/B-%E6%95%99%E5%AD%A6%E6%A1%88%E4%BE%8B%E4%B8%8E%E5%AE%9E%E8%B7%B5/B13-AI%E5%AF%B9%E8%81%94%E7%94%9F%E6%88%90%E6%A1%88%E4%BE%8B/docs/train_on_pai.md)，我们采取的是在本地训练，用了30个小时，有点长，你可以直接用我们训练好的数据，如下，已经放到相应的目录下。

```
  checkpoint
  model.ckpt-26675.data-00000-of-00002
  model.ckpt-26675.data-00001-of-00002
  model.ckpt-26675.index
  model.ckpt-26675.meta
```

原教程中还进行了模型推理，我们不使用该模型文件进行模型推理，而是将它封装成api。

## 开启模型服务

### 安装tensorflow-serving-api
```
pip install tensorflow-serving-api==1.14.0
注意：安装tensorflow-serving-api会自动安装tensorflow的cpu版本，会覆盖tensorflow-gpu版本。
```

### 安装tensorflow_model_server：

用“sudo -i”进入了root，然后重新执行下面三条安装tensorflow-model-server的语句，走完，Ctrl+d，退出来就行了。

```
sudo apt-get remove tensorflow-model-server

echo "deb [arch=amd64] http://storage.googleapis.com/tensorflow-serving-apt stable tensorflow-model-server tensorflow-model-server-universal" | sudo tee /etc/apt/sources.list.d/tensorflow-serving.list && \
curl https://storage.googleapis.com/tensorflow-serving-apt/tensorflow-serving.release.pub.gpg | sudo apt-key add -

sudo apt-get update && apt-get install tensorflow-model-server
```

### 启动服务

用下面的语句可以导出我们训练好的模型，不过我们已经导出过了，所以下面这句不用执行：

```
cd up2down_model

t2t-exporter --model=transformer  \
        --hparams_set=transformer_small  \
        --problem=translate_up2down  \
        --t2t_usr_dir=./usr_dir \
        --data_dir=./data \
        --output_dir=./output
```

将导出的模型封装成api：

```
tensorflow_model_server --port=9000 --model_name=up2down --model_base_path=$HOME/ratcode/up2down_model/output/export
```

注意：model_base_path得是/output/export的绝对路径才行，如果你没报错，这条不用管。这时模型已被封装成api了。

## 搭建后端服务

[安装Web服务器](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-cli#install-web-server)，为了方便查看运行中的虚拟机，安装NGINX Web服务器。

```
sudo apt-get -y update
sudo apt-get -y install nginx
```

![image.png](https://upload-images.jianshu.io/upload_images/2298266-09c4d97a6faebaa2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这时，你用虚拟机的公网地址，应该可以访问了，如下图：

![image.png](https://upload-images.jianshu.io/upload_images/2298266-0e7daef36fc263b4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

其实，这个地方是默认开了80端口，你用公网ip加上“:80”，也同样出现上面的情况。

安装flask：
```
pip install flask
```

启动服务，注意，此时我们是在ratcode文件夹内：

```
nohup python app.py &
```

nohup 是为了让程序即使在webshell关闭了，服务也能被访问，否则等webshell关闭了，服务也停了。

flask服务启动起来后，占用了5000端口，此时需要在云服务器的安全组里，将5000端口添加进入站口规则。[设置教程](https://cloud.tencent.com/document/product/213/34601)

![image.png](https://upload-images.jianshu.io/upload_images/2298266-dd8a7d94bab855bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击编辑后，在协议端口处添加5000，然后保存就可以了：

![image.png](https://upload-images.jianshu.io/upload_images/2298266-052a3c987442a26e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

此时，就可以通过公网ip+5000端口访问了，例子：“http://106.54.14.94:5000/?upper=一月又一月”。小程序也可以这样来访问flask服务。

![image.png](https://upload-images.jianshu.io/upload_images/2298266-8be82f06f34f1750.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 搭建小程序

需要下一个[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)，然后导入项目（在duiCouplet文件夹内），选择测试APPID，然后就可以看到效果了。

![image.png](https://upload-images.jianshu.io/upload_images/2298266-8ab202f078133567.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

点击编译，然后在左侧的输入框输入上联就可以了：

![image.png](https://upload-images.jianshu.io/upload_images/2298266-c94ebcf81b54dde3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

不过，这里你要修改成你自己的ip地址，在index.js的wx.request函数里面的url：

![image.png](https://upload-images.jianshu.io/upload_images/2298266-599ed9e261e5d59f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![2020-01-12-4pyBPDemo.gif](https://upload-images.jianshu.io/upload_images/2298266-1c275fdca8fa7229.gif?imageMogr2/auto-orient/strip)
