<template>
  <div v-loading="loading" :class="teammarkWrapperClass">
    <div class="teammark-search-unlogin" v-if=" !loading && this.companyList.length === 0">
      <img src="data:image/png;base64,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" alt="">
      <el-link :href="teammarkConfig.loginDomain" class="teammark-search-login" target="_blank">去登录</el-link>
      <div class="teammark-search-footer">Powered by Teammark</div>
    </div>
    <el-container class="teammark-search-container" v-show="!loading && this.companyList.length > 0">
      <el-header class="teammark-search-header">
        <img class="teammark-search-header-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAADmElEQVRoge3YXYiUVRzH8c9/dw1fUjMLLwKVSLqIXjAwQSkFoQx6gRKtvAikF3pBxNbdklAKyV3F3gQjCESEgm66KIIoKo0szVAL6ybBvBDpDUvTWHdOFzO7rLHzzJmZ3YVgvhczwzn//+/8f8955jznObRo0aJFixb/Y2LMRupJkzEfN2hzneQaXIVpuAx9OCUcwA6d8XGO7OgZ2JguNdFCYZFkMeaiIzO7X3K7rvikVmCuYB5b0xX63S8sx0J0SA0pteNRjIGB19IU590rWaFkiTCuaU1oMzcnrHEDPelaPOG8VZg04jdjcmVOWP0GetI8YQPurDu3PibkBOUb2JxmarMN9zVaUZ38kxOUZ2BLekTyMiY1U1FdJGdywmob6E3bJU82XVC9hOM5YcUGetJaqhb/Or6v0teOzTgsvCmZjq1DxruA53EcD+CuYTSOFdZWodhAWFPQ+651sbdqb2/qFl4YfKL2ppvwcEX3bZ2xudL+m+EMJD8V1lah1i00vqDvI73pHChZrDsO603f4Gq0Yaqk3L8pzZDsEBUD7LQpzbA+Tgl/VXnYZRloq9Ff/QqXzU3DNB2DF2JKpW3qRZGXWK4r9uMoTjjrMx2WFY7c7miN2lDbwFs5IjVJHpRSSHYKu22QhBUFGedMdihHutjAungf++oodXiSmba41SV2C7v0WIBZBfEHPBZ9OdK1ZoDwuPJWt3FCCSutiZOeiR+1eQilgvgvc6VrG+iMI8KmXMEqlLDMljTJtjQByxQb+CpXOO9JfNaLJrrZ8Ot1DiXlVek9ffqE6fizSmyfC/bkCteeAdgYJeOtxA/D9vcP7kUv1isNtg98LxGWVn6nyud/a9jj2fgjqy71vpH1pjn4WnmpHMoxyWnhRhebqNZOeVYO4XLMHmxNntYV23NLqn8X35tuwwdGZ2OXtJtlbZzITci7hYayLj5XcofI2y3WycF6iqcRA9AdX+i3dBRM7Ko3oTEDlE2U3I2zDWsMJZxRGksD0BWfKlmAn5vSKbNLd5yuN6k5A9Adh40zH/ub0un3RiNpzRuANXFSh0WSdxrKTz7UHd81kjqyhyEpha1WS15S/C4xlH5hrs440siQIzMDA0QknfGKcAu+zcpJXm20eEbawACdccRs84TV+L0g8qBz1jcz1OifTpePHp/CKuXXzQH2ueAez8UvzciP3fF6+f9xvWQOfvW3vTZG9S11ixYtWrQYC/4F6aLt+UBbMckAAAAASUVORK5CYII=" alt="">
        <div class="teammark-search-header-name">
          <el-select v-model="selectCompanyValue" placeholder="请选择" size="small" style="width: 200px;" @change="handleCompanyChange">
            <el-option
                    v-for="item in companyList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"></el-option>
          </el-select>
        </div>
        <div class="teammark-search-header-slogan">内部快搜</div>
      </el-header>
      <el-main v-loading="searchLoading" class="teammark-search-main" v-if="searchListMsgCode === 200 && searchResult && searchResult.total > 0">
        <div class="teammark-search-main-title">
          <span>在 <strong style="color: #121212">TeamMark</strong> 内找到<strong style="color: #121212">{{ searchResult && searchResult.total || '' }}</strong>条相关结果</span>
          <a :href ="teammarkConfig.protocol + '://'+selectCompany.domainSuffix+'/search?q='+searchWord" target="_blank">查看全部结果</a>
        </div>
        <div class="teammark-search-main-body" @scroll="handleScroll">
          <div class="teammark-search-main-body-scroll">
            <div class="teammark-search-result-item" v-for="item in searchResult && searchResult.datas" @click="() => handleJumpToDetail(item)">
              <div class="title" v-html="item.title || (item.docBelong && item.docBelong.docTitle) || ''"></div>
              <div class="content" v-html="item.content"></div>
            </div>
          </div>
        </div>
      </el-main>
      <div class="teammark-search-empty" v-if="searchListMsgCode === 103">
        登录过期，请重新<a :href ="teammarkConfig.protocol+'://'+selectCompany.domainSuffix+'/login'" target="_blank">登录</a>
      </div>
      <div class="teammark-search-empty" v-if="(searchResult && searchResult.total === 0) || (errMsgCode !== 200)">在TeamMark中无相关搜索结果</div>
      <div class="teammark-scroll teammark-scroll-left" v-show="scrollLeftVisible" @click="() => handleBtnScroll('left')"><i class="el-icon-arrow-left"></i></div>
      <div class="teammark-scroll teammark-scroll-right" v-show="scrollRightVisible" @click="() => handleBtnScroll('right')"><i class="el-icon-arrow-right"></i></div>
    </el-container>
  </div>
</template>

<script>
  import { matchSearchUrl, BAIDU, GOOGLE } from "./utils";

  export default {
  data() {
    return {
      loading: true,
      searchLoading: true,
      saasCookies: [],
      companyList: [],
      selectCompany: [],
      selectCompanyValue: '',
      searchWord: '',
      searchResult: null,
      scrollLeft: 0,
      scrollLeftVisible: false,
      scrollRightVisible: false,
      initFlag: false,
      scrollOffsetWidth: 0,
      scrollInnerOffsetWidth: 0,
      searchListMsgCode: 0,
      errMsgCode: 0,
      teammarkWrapperClass: 'teammark-search',
      teammarkConfig: require('../../teammark.config')[process.env.TM_ENV],
    }
  },
  mounted() {
    this.handleGetSearchKeyword();
    this.cookieFromBackground();
  },
  watch: {
    scrollLeft(val) {
      // scrollLeft > 0， 显示左边的按钮
      this.scrollLeftVisible = val !== 0;
      this.scrollRightVisible = val + this.scrollOffsetWidth !== this.scrollInnerOffsetWidth;
    }
  },
  methods: {
    cookieFromBackground() {
      chrome.runtime.sendMessage({
        type: 'getCookie',
      }, res => {
        // console.log(res);
        this.errMsgCode = res.code;
        if (res.code !== 200) {
          this.loading = false;
          return;
        }
        this.saasCookies = res.saasCookies || [];
        this.companyList = res.companyList || [];
        if ( this.companyList.length === 0) {
          this.loading = false;
          return;
        }
        this.selectCompany = this.companyList[0];
        this.selectCompanyValue = this.selectCompany.code;
        this.handleGetSearchList({domain: this.selectCompany.domainSuffix});
        this.loading = false;
      })
    },
    handleGetSearchKeyword() {
      const url = location.href;
      if (matchSearchUrl(url) === BAIDU) {
        this.searchWord = $('#kw').val();
        this.teammarkWrapperClass = "teammark-search result c-container";
      } else if (matchSearchUrl(url) === GOOGLE) {
        this.searchWord = $('input[name="q"]').val();
        this.teammarkWrapperClass = "teammark-search g";
      }
    },
    handleGetSearchList() {
      this.searchLoading = true;
      chrome.runtime.sendMessage({
        type: 'getSearchList',
        data: { domain: this.selectCompany.domainSuffix, keyword: this.searchWord }
      }, res => {

        // console.log(res);
        this.searchResult = res && res.data || {};
        this.searchListMsgCode = res.code;
        this.searchLoading = false;
        this.$nextTick(() => {
          this.handleInitScrollContaniner()
        })
      })
    },
    handleInitScrollContaniner() {
      this.scrollOffsetWidth = $('.teammark-search-main-body').length > 0 && $('.teammark-search-main-body')[0].offsetWidth;
      this.scrollInnerOffsetWidth = $('.teammark-search-main-body-scroll').length > 0 && $('.teammark-search-main-body-scroll')[0].offsetWidth;
      // 内部元素宽度小于父元素宽度，不出现滚动条，滚动点击按钮
      if (this.scrollInnerOffsetWidth <= this.scrollOffsetWidth) {
        this.scrollLeftVisible = false;
        this.scrollRightVisible = false;
      } else {
        this.scrollLeftVisible = false;
        this.scrollRightVisible = true;
      }
    },
    handleScroll(e) {
      this.scrollLeft = e.target.scrollLeft;
    },
    handleBtnScroll(direction) {
      if (direction === 'left') {
        $('.teammark-search-main-body').animate({scrollLeft: this.scrollLeft - 200}, 500);
      } else {
        $('.teammark-search-main-body').animate({scrollLeft: this.scrollLeft + 200}, 500);
      }
    },
    handleCompanyChange() {
      this.selectCompany = this.companyList.filter(item => item.code === this.selectCompanyValue)[0];
      this.handleGetSearchList();
    },
    handleJumpToDetail(item) {
      const zoneId = item.zoneBelong && item.zoneBelong.zoneId || '';
      const articleId = item.entityId && item.entityId || '';
      window.open(`${this.teammarkConfig.protocol}://${this.selectCompany.domainSuffix}/${zoneId}/articles/${articleId}`, "_blank")
    }
  }
}
</script>

<style lang="scss">
  @import "../assets/reset.css";
  .teammark-search {
    background:rgba(250,250,251,1);
    border-radius:1px;
    border:1px solid rgba(229,229,231,1);
  }

  .teammark-search-unlogin {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 156px;
      height: 72px;
    }

    .teammark-search-login {
      width:240px;
      height:40px;
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
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }

  .teammark-search-header {
    width: 100%;
    height: 36px !important;
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
    }

    &-slogan {
      position: absolute;
      right: 20px;
      font-weight:bold;
      color:rgba(0,138,255,1);
      line-height:12px;
      margin-left: 140px;
    }
  }

  .teammark-search-container {
    position: relative;
  }

  .teammark-search-main {
    height: 236px;
    padding: 16px;
    overflow-y: hidden;

    &-title {
      display: flex;
      justify-content: space-between;
      font-size:12px;
      font-weight:400;
      line-height:12px;

      span {
        color:rgba(138,138,142,1);
      }

      a {
        line-height:12px;
      }
    }

    &-body {
      overflow-x: auto;
      margin-top: 16px;

      &-scroll {
        display: inline-flex;

        .teammark-search-result-item {
          width: 146px;
          height: 182px;
          background: white;
          border: 1px solid #EBEEF5;
          margin-right: 10px;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,.1);
          cursor: pointer;

          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size:14px;
            font-weight:400;
            color:rgba(44,44,46,1);
            line-height:22px;
            padding: 10px 10px 0 10px;
          }

          .content {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 6;
            font-size:12px;
            font-weight:400;
            color:rgba(138,138,142,1);
            line-height:20px;
            padding: 8px 10px 0;
          }
        }
      }
    }
  }

  .teammark-search-empty {
    height: 62px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(138,138,142,1);
    line-height: 62px;
    margin: 0 auto;
  }

  .teammark-search-footer {
    height: 12px !important;
    font-size: 12px;
    font-weight: 400;
    color: rgba(221,221,221,1);
    line-height: 12px;
    text-align: center;
  }

  .teammark-scroll {
    position: absolute;
    background: white;
    font-size: 24px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(138,138,142,1);
    box-shadow: 1px 1px 5px 5px #e4e7ed;
    cursor: pointer;
    top: 114px;
    opacity: 0.6;
    transition: opacity 0.5s,visibility 0.5s;

    &:hover {
      opacity: 1.0;
    }
  }

  .teammark-scroll-left {
    left: -20px;
  }

  .teammark-scroll-right {
    right: -20px;
  }
</style>
