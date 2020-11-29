<template>
  <div v-loading="loading" class="teammark-search">
    <div class="teammark-search-unlogin" v-if=" !loading && this.companyList.length === 0">
      <img src="https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/images/icon-logo.png" alt="">
      <el-link :href="teammarkConfig.loginDomain" class="teammark-search-login" target="_blank">去登录</el-link>
      <div class="teammark-search-footer">Powered by Teammark</div>
    </div>
    <el-container class="teammark-search-login" v-show="!loading &&this.companyList.length > 0">
      <el-header class="teammark-search-header">
        <img class="teammark-search-header-logo" src="https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/images/icon-logo.png" alt="">
        <div class="teammark-search-header-name">
            <span class="teammark-search-header-name__text" v-if="companyList.length === 1">{{ companyList[0].name }}</span>
            <el-select v-else v-model="selectCompanyValue" placeholder="请选择" size="small" @change="handleCompanyChange" style="width: 200px;">
            <el-option
                    v-for="item in companyList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"></el-option>
          </el-select>
        </div>
        <img class="teammark-search-header-slogan" src="https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/images/icon-text.png"/>
      </el-header>
      <el-main class="teammark-search-main">
        <el-input class="teammark-search-main-search" placeholder="搜索文档、空间、用户" v-model="searchWord" prefix-icon="el-icon-search" @keyup.enter.native="handleSearch">
        </el-input>
      </el-main>
      <el-footer class="teammark-search-footer">
        Powered by Teammark
      </el-footer>
    </el-container>
    <div class="teammark-search-newversion" v-if="updateInfo.shouldUpdate && updateInfo.shouldRemind || updateInfo.shouldForceUpdate">
      <img class="img" src="data:image/png;base64,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" alt="">
      <div class="title">更新插件至最新版本</div>
      <div class="btn">
        <el-button size="small" v-if="!updateInfo.shouldForceUpdate" @click="handleRemindLater">明天再提醒</el-button>
        <el-button size="small" type="link">
          <a :href="updateInfo.versionUrl" target="_blank">下载并更新</a>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loading: true,
        saasCookies: [],
        companyList: [],
        selectCompany: [],
        selectCompanyValue: '',
        searchWord: '',
        errMsgCode: 0,
        teammarkConfig: require('../../teammark.config')[process.env.TM_ENV],
        updateInfo : {
          shouldForceUpdate: false,
          shouldUpdate: false,
          shouldRemind: false,
          versionDesc: null,
          versionUrl: null,
        },
      }
    },
    mounted() {
      this.cookieFromBackground();
    },
    methods: {
      cookieFromBackground() {
        // 获取background的window, 这样会有点问题？可能取不到bg的变量，所以又改成 sendMessage 通信了
        // const bg = chrome.extension.getBackgroundPage();
        chrome.runtime.sendMessage({
                  type: 'getCookie',
                }, res => {
          this.init(res)
        })
      },
      init({ saasCookies, companyList, code, updateInfo}) {
        this.errMsgCode = code;
        this.updateInfo = updateInfo;
        if (code !== 200) {
          this.loading = false;
          return;
        }
        this.saasCookies = saasCookies || [];
        this.companyList = companyList || [];
        if ( this.companyList.length === 0) {
          this.loading = false;
          return;
        }
        this.selectCompany = this.companyList[0];
        this.selectCompanyValue = this.selectCompany.code;
        this.loading = false;
      },
      handleSearch() {
        const domainSuffix = this.selectCompany.domainSuffix;
        const el = document.createElement("a");
        document.body.appendChild(el);
        el.href = `${this.teammarkConfig.protocol}://${domainSuffix}/search?q=${this.searchWord}&from=tm-plugin`; //url 是你得到的连接
        el.target = '_new'; //指定在新窗口打开
        el.click();
        document.body.removeChild(el);
      },
      handleCompanyChange() {
        this.selectCompany = this.companyList.filter(item => item.code === this.selectCompanyValue)[0];
      },
      // 设置明天再提醒
      handleRemindLater() {
        chrome.runtime.sendMessage({
          type: 'setShouldRemind',
          data: this.updateInfo
        }, res => {
          this.updateInfo = { ...this.updateInfo, shouldRemind: false };
        })
      }
    },
  }
</script>

<style lang="scss">
  @import "../assets/reset.css";
  .teammark-search {
    width:480px;
    height:240px;
  }
  .teammark-search-unlogin {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 72px;
      height: 72px;
      margin-top: 32px;
    }

    .teammark-search-login {
      width:240px;
      height:40px;
      margin-top: 32px;
      background:rgba(0,138,255,1);
      color: #fff;
      border-radius:5px;

      &:hover {
        color: #fff;
        background-color: #3399ff;
        border-color: #3399ff;
      }
    }

    .teammark-search-footer {
      line-height: 12px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(221,221,221,1);
      margin-top: 24px;
    }
  }

  .teammark-search-header {
    width:480px;
    height:36px !important;
    background:rgba(255,255,255,1);
    box-shadow:0 1px 0 0 rgba(229,229,231,1);
    display: flex;
    align-items: center;
    position: relative;

    &-logo {
      width: 28px;
    }

    &-name {
      font-weight:500;
      color:rgba(44,44,46,1);
      line-height:14px;

      .el-input__inner {
        border: none;
      }

        &__text{
            padding-left: 15px;
            color: #606266;
            height: 34px;
            line-height: 34px;
            font-size: 14px;
        }
    }

    &-slogan {
      font-weight: bold;
      color: rgba(0,138,255,1);
      line-height: 12px;
      position: absolute;
      right: 20px;
    }
  }

  .teammark-search-main {
    margin-bottom: 48px;
    &-search {
      margin-top: 40px;
      input {
        border-radius: 20px;
        background: rgba(247, 247, 249, 1);
      }
    }
  }

  .teammark-search-footer {
    height: 12px !important;
    font-size: 12px;
    font-weight: 400;
    color: rgba(221,221,221,1);
    line-height: 12px;
    text-align: center;
  }

  .teammark-search-newversion {
    background: rgba(250,250,251,1);
    position: absolute;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;

    .img {
      width: 84px;
      height: 84px;
      margin-top: 10px;
    }

    .title {
      margin-top: -50px;
      font-size: 14px;
      font-weight:400;
      color:rgba(138,138,142,1);
      line-height:14px;
    }

    .desc {
      overflow: auto;
      padding: 0 40px;
      flex: 1;
      height: 100%;
      font-size: 12px;
      color: rgba(138,138,142,1);
    }

    .btn {
      margin-bottom: 10px;

      .el-button {
        color: white;
        background:rgba(0,138,255,1);
      }
      a {
        color: inherit;
        text-decoration: none;
      }
    }
  }

  .teammark-search-desc-tooltip {
    max-width: 400px;
  }

  .el-select-dropdown__wrap {
      max-height: 150px;
  }

</style>
