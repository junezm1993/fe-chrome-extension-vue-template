<template>
  <div v-loading="loading" :class="teammarkWrapperClass">
    <div class="teammark-search-unlogin" v-if=" !loading && this.companyList.length === 0">
      <img src="https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/images/icon-logo.png" alt="">
      <el-link :href="teammarkConfig.loginDomain" class="teammark-search-login" target="_blank">去登录</el-link>
    </div>
    <el-container class="teammark-search-container" v-show="!loading && this.companyList.length > 0">
      <el-header class="teammark-search-header">
        <img class="teammark-search-header-logo" src="https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/images/icon-logo.png" alt="">
        <div class="teammark-search-header-name">
          <span class="teammark-search-header-name__text" v-if="companyList.length === 1">{{ companyList[0].name }}</span>
          <el-select v-else v-model="selectCompanyValue" placeholder="请选择" size="small" :style="'width:' + selectWidth +'px;max-width: 200px;'" @change="handleCompanyChange">
            <el-option
                    v-for="item in companyList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"></el-option>
          </el-select>
        </div>
        <div class="teammark-search-select-fakewidth" style="visibility: hidden">{{ selectCompany.name }}</div>
        <img class="teammark-search-header-slogan" src="https://sjk-teammark.oss-cn-shenzhen.aliyuncs.com/fe/nodejs/app-version/images/icon-text.png"/>
      </el-header>
      <el-main v-loading="searchLoading" class="teammark-search-main" v-if="searchListMsgCode === 200 && searchResult && searchResult.total > 0">
        <div class="teammark-search-main-title">
          <span>在 <strong style="color: #121212">TeamMark</strong> 内找到<strong style="color: #121212">{{ searchResult && searchResult.total || '' }}</strong>条相关结果</span>
          <a style="color:rgba(0,138,255,1);text-decoration: none" :href ="teammarkConfig.protocol + '://'+selectCompany.domainSuffix+'/search?q='+searchWord" target="_blank">查看全部结果</a>
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
        登录过期，请重新<a :href ="teammarkConfig.protocol+'://'+selectCompany.domainSuffix+'/'" target="_blank">登录</a>
      </div>
      <div class="teammark-search-empty" v-if="(searchResult && searchResult.total === 0) || (errMsgCode !== 200)">在TeamMark中无相关搜索结果</div>
      <div class="teammark-scroll teammark-scroll-left" v-show="scrollLeftVisible" @click="() => handleBtnScroll('left')"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABF1BMVEUAAAD///9VVVVAQEBJSUlHR0c7O0VAQEY8PEY9PUQ9PUQ9PUM8PEQ9PUQ9PUQ+PkQ9PUM8PEM9PUQ9PUM8PEQ8PEM8PEM8PEM8PEQ8PEQ9PUM8PEQ8PEM8PEM9PUQ+PkU/P0dBQUdBQUhCQklDQ0pEREpFRUtFRUxGRk1HR05ISE5JSU9JSVBLS1JMTFJNTVNOTlVQUFZRUVdSUllVVVtYWF1bW2BeXmSMjJCMjJGlpamnp6q7u72+vsHDw8XDw8XGxsjHx8nJyczLy83Nzc/OztDQ0NLR0dLT09XV1dbY2NnZ2drb29zb293b29ze3t/g4OHh4eLi4uPj4+Tk5OXn5+jo6Ojp6erq6uvs7O3u7u7+/v7///9Bw8JrAAAAXHRSTlMAAQMMDhIaLDNHU1RibG14eY2Xp62ztr7HyMnL1NnZ2dnZ2dra2tra2trb29vb29vc3Nzc3d3e3ufn7Ozw8fHy8vLz8/T09PX19fb29vb39/f4+Pj5+fn6+vr7/vKAzqcAAAFiSURBVFjDxdfXUgJBFARQco6C5DZnDKiAOSuYMSva//8dPvi6u7O1XRbzAadqZu7cue2DYTVq5WI+HQ/77BZcrvFsVAMAlFJBDQDqmZAGANWEXwOAQkQEUImJABpJEQByARHAWEAEkFMBJFWgERMBVCIigIJfBJBQgWpIBJBRgXpQBJBSgZIJWDnYcxaizsDqA3+ajkDWEVgfkD1Dr3YCWk/k9aLhFML2wOYL2Zs3HWPcFth+Iy/njPeQtgPa7+T5jPki8zZA55M8nXZRCUVroDskj6fclFLZEtj5Jo8mXdVizRK4Jw8nXHY2S+BWBbpDcQvofJEnwiEC7Q/yTLjGv0K8mPVeSMDWK3kllDLQeib7C94fE7AxIG+WvD9nYO2R7AsNBWjeaS0NWN7flZqq3tb/+2ORv7bMqL/3xIhHHHXIkse85IhHXXXYFsd9NXCokUcMXWLsE4OnFn09h29T/P8FJUGwqrcDihEAAAAASUVORK5CYII="></div>
      <div class="teammark-scroll teammark-scroll-right" v-show="scrollRightVisible" @click="() => handleBtnScroll('right')"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAABFFBMVEUAAAD///9VVVVAQEBJSUlHR0c7O0VAQEY8PEY9PUQ9PUQ9PUM8PEQ9PUQ9PUQ+PkQ9PUM8PEM9PUQ9PUM8PEQ8PEM8PEM8PEM8PEQ8PEQ9PUM8PEQ8PEM8PEM9PUQ+PkU/P0dBQUdBQUhCQklDQ0pEREpFRUtFRUxGRk1ISE5JSU9JSVBLS1JMTFJNTVNOTlVQUFZRUVdSUllVVVtYWF1bW2BeXmSMjJCMjJGlpamnp6q7u72+vsHDw8XDw8XGxsjHx8nJyczLy83Nzc/OztDQ0NLR0dLT09XV1dbY2NnZ2drb29zb293b29ze3t/g4OHg4OHi4uPj4+Tk5OXn5+jo6Ojp6erq6uvs7O3u7u/+/v7///8iJVQSAAAAW3RSTlMAAQMMDhIaLDNHU1RibG14eY2Xp62ztr7HyMnL1NnZ2dnZ2dra2tra2tvb29vb29zc3Nzd3d7e5+fs7PDx8fLy8vPz9PT09fX19vb29vf39/j4+Pn5+fr6+vr+oICVhgAAAWhJREFUWMO1l9daAjEQhem9iCB1x14QCyrYCzawY6/n/d/DSy/cTWLOOrfZ/PtlMpk5JxDwiGgyWyhV6o5own13PD8mhuGyO5wpi3n82h7JNUTsAcFUTYQAxIoiDCBRFQqQdoQBhEZEGEBoVDiA3f9/AGnhAAmHA8SqQgGCReEAKeEAkRoJyAkHCDdIQEZIQJkExNUf7OwtagB55XrrC7dLaoCm//aB4YoKENWcceECuG8rAEldlub6wOOaNyCrzfPsGfC84Qko6G9q+gR46XgBSgZ3PdUD3roegIpJtUweAh+b7oC6Ub1NHACfW64Aw142vg/csIAr8gjuSTBM4hHw3iWu8Rh47dgX0sypohRNSvkceFq3f0zzA+Chbf+cm5fAcJVoKAPgbplradctqqlu7zb/u63zg4UebfRw5cc7LTB4iUOLLF7m8UKTl7q82KblPm84fLA8vOnibR9vPH2wvj6Y77/Z/289e7BCQG/nSAAAAABJRU5ErkJggg=="></div>
    </el-container>
    <div class="teammark-search-newversion" v-if="updateInfo.shouldUpdate && updateInfo.shouldRemind || updateInfo.shouldForceUpdate">
      <img class="img" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAACBFBMVEUAAAD///9/f39VVVVAQEAzM2ZmZmZVVVVJSUlAQEBAQGA5OVVVVVVNTU1GRkZAQEBAQFU7O05JSUlERERAQFA8PEtHR0dDQ0NAQE09PUlGRkZDQ0NAQEo7O0VCQkJCQkxAQEk+PkY7O0RERERCQkJAQEg+PkZCQkJCQklAQEc+PkU8PENBQUhAQEY+PkQ9PUNBQUdAQEY+PkQ9PUM8PEdBQUdAQEU+PkQ9PUI9PUc8PEY/P0M9PUI8PEY7O0RAQEQ/P0M+PkY9PUVAQEQ/P0M+PkI+PkY9PUU8PEQ/P0M+PkY9PUU8PEM/P0M/P0Y+PkU9PUQ8PEM/P0I+PkU9PUQ8PEM8PEI/P0Y+PkU9PUQ9PUM8PEU/P0U+PkQ9PUQ9PUM8PEU+PkQ+PkM9PUM8PEU+PkQ+PkM9PUM8PEU+PkQ+PkM9PUI8PEQ+PkQ+PkM9PUU9PUQ8PEM+PkM9PUI9PUU9PUQ8PEM8PEM+PkM9PUQ9PUQ8PEM8PEM+PkU9PUQ9PUQ8PEM8PEM+PkQ9PUQ9PUM8PEI+PkQ9PUM9PUM8PEI+PkQ9PUM9PUM8PEQ8PEQ9PUM9PUM8PEQ8PEQ+PkQ9PUM9PUM8PEQ8PEM9PUM9PUM9PUQ9PUQ8PEM9PUM9PUQ9PUQ8PEM+PkM9PUI9PUQ9PUQ8PEM8PEM+PkM9PUQ9PUQ8PEM8PEN3l6RbAAAArHRSTlMAAQIDBAUFBgcICAkJCgsMDA0ODxAREhMUFRYXGBobGxwdHh4fICEjIyQlJicoKSorLC0uLy8wMTIyMzU2Nzg4OTo7PD0+Pj9AQUJDREVFRkdISUpLTE1NTk9QUVFSU1RVVldYWVpbXF1eX2BiYmNkZWZnaGhpamtrbG1ub29wcXJzdHV2d3h5ent8fX5/gIGCg4SEhYaHiImKiouMjY6PkJGSkpOUlZWWl5iZUIJlLgAABaJJREFUGBntwYtbU2UAB+DfzqaTIWSQBjEzLJeSQZKSYagZZSZdVFTSMvGKmEy6aSqRkoJJKiWKgAEy5nZ+/2S771y+nnZ2xs6enu99IUmSJEmSJEmSJEmSJEmSJEnSf3v75kwobnakDaWshVntKGF3mDXlRslaRa31KFlt1NqHktVDrSsoWfepNaugZNT2T97d60ZKFfXqkaLsuv2wrxbOaZhjzN0NSGql3idIWjvMmPk34ZQ3Qkw6V4m4U9T7HnG+bpUJC01wxsYQ057sBBr7wtQL96wHWh8z7VkznNAYosaN2xS5cY0akRYUX2CB1kWaUHT3mY9JF4qsivmpRZEtiTAfqg/F1s98/Iii80doXfRlFN8xWncCDvBN0qrpCjhhO63aBWf8RmuGXXBGvUpL1sEhnicUiTwKU2TWC4fsoIl6ZctKBa7q5ksqTXbDIUM0ul6LtJpBGt2GEzwbDtHoqIIspYtGXzYsQVF5GjoHQzT5EnqdNAlfP7RxKYqk4dICRa4p0HNdpsizq40ohs0qhSLVMHo+TCG1FUVwm2J9MOul2B8ogjDFXofZaxSLKlh8/BdLYKZEKebB4qPYBEQeUMyDxUexEYj8RjEPFh/FHkHkL4p5sPgopnpgpkQo5oFR/Xs7Y9oCKBiVYutg9gr/hRt6rvNMGfSiQP6iWC/MzlBsAgabmNGJAvmMYuHnYFQRothBGPQyYxQF4jr0lEL9MOqjUOiYAoNxZqjLUSjLmo/ditLsM+jtoZk6cnxLOYxWUeMtFNKypiNDNIjuhdbHERrcPLrJhzTXugY3UrZTowtprwUUFMIwjS6WI833LY1GoVF3h3zYgqQeagwiKfA7Od6AAminydOTfsS91D1Lkw5k+acYd/lFxI1RY15BTPkplTELTbDPO0OB+dFrd+Yo8LQcGf4pJoW+cKPuOHW6/cC7j5kU3gTbvBO0YtKHNP8UM0Yv0eTqz8x41gy7jtGabqRUTdCCSAD2vBylNepaJH1DS36FLa6btGpEQUKQltyFLe20bg8SPqIlJ2HH8zO0brYacd6HtCC0CnacZj56kbCVFuyDHUqI+Yh4kfALc3bPDTt8zE81EvwR5upN2DPGfEwg5RvmKAibmpmPbUipiDI3q2HXbmo9maXI3DS19iOtlSYLD8bmaHIQtu1lVk+lr+MejcYPVFScUZnRiYwr1FN7NygA1hyZp9447PucKaPrERek3pCCmMAdphxESlljV4Q64/VIqb5BvdMtK2DXfsaFvnAjYRf1DiFB6ZhnXBfiyluOj0RpcH8FMtyXaXTv7PYXYMv7f1MNrkJKLfU2ImXlhShn2hH3aYhm83XQKLtHM/WcG3YodZXImqBWZCkyKusUxDVS5DB0mimyG4XTR60hmJ2igLoCen9SoB+F8yG1jsAsSIFhGJyiwAAKx0+tJpgFKXARBh0UGEABjTNrzguzIAV6YNBOgQEU0MfM6oJAkAI/weAABQZQSJ9MMOlJpwsCQQo8gsEPFBhAYZVVxvkg1k2RddApm6dAH4rpVZUCV6FzmCJtKKqWcQq0QyMQptlMJ4rMtfqD82M0iLyLjPopGjz+riPghiNWbJmk3ldlSFDaQ9R7vwZOOkGD6ROb165p6hqjwRCc5VeZm21wlneaufHDWV8zR4Nw1CtR5qoNDlJuMWfTFXDOHlpwFo6pmqMVATilk5b0wyk9tGQYTtlBS47DKa5LtGC0DI5ZOsiMMx+O0eDxgX0hpt2vgoOWDTFp9HXA1RSl1g43UHOFSQ9WwlHlI4wJ7XMj7hY1ppHQOsmYRzVw2PILkWh/DZK+psaPSCrvnld/eRHOW+JG2iZqfIo0xYsS41OZFUAJG2bGghsl7CgzBlHK/BGmbUVJe+dPJkzsRqnzlMUshSRJkiRJkiRJkiRJkiRJkiRJ/xP/AL56eA99iGkPAAAAAElFTkSuQmCC" alt="">
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
        selectWidth: 100,
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
          this.updateInfo = res.updateInfo;
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
          this.handleResetSelectWidth();
          this.loading = false;
        })
      },
      handleGetSearchKeyword() {
        const reg = new RegExp("(^|&)keyword=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        const r = window.location.search.substr(1).match(reg); //匹配目标参数
        this.searchWord = decodeURI(r[2]);
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
            this.handleInitScrollContaniner();
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
          $('.teammark-search-main-body').animate({scrollLeft: this.scrollLeft - 470}, 500);
        } else {
          $('.teammark-search-main-body').animate({scrollLeft: this.scrollLeft + 470}, 500);
        }
      },
      handleCompanyChange() {
        this.selectCompany = this.companyList.filter(item => item.code === this.selectCompanyValue)[0];
        this.handleGetSearchList();
        this.handleResetSelectWidth();
      },
      handleResetSelectWidth() {
        this.$nextTick(() => {
          const fakeOptionsDom = $('.teammark-search-select-fakewidth');
          this.selectWidth = fakeOptionsDom[0].offsetWidth + 55;
        })
      },
      handleJumpToDetail(item) {
        const zoneId = item.zoneBelong && item.zoneBelong.zoneId || '';
        const articleId = item.entityId && item.entityId || '';
        window.open(`${this.teammarkConfig.protocol}://${this.selectCompany.domainSuffix}/${zoneId}/articles/${articleId}?from=tm-plugin`, "_blank")
      },
      // 设置明天再提醒
      handleRemindLater() {
        chrome.runtime.sendMessage({
          type: 'setShouldRemind',
          updateInfo: this.updateInfo,
          data: { domain: this.selectCompany.domainSuffix, keyword: this.searchWord }
        }, res => {
          this.updateInfo = { ...this.updateInfo, shouldRemind: false };
        })
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
      width: 80px;
    }

    .teammark-search-login {
      width:240px;
      height:40px;
      background:rgba(0,138,255,1);
      color: #fff;
      border-radius:5px;
      margin-bottom: 10px;

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
    padding: 0 16px;

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
    height: 242px;
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
      margin-bottom: 16px;

      &-scroll {
        display: inline-flex;

        .teammark-search-result-item {
          width: 146px;
          height: 182px;
          background: white;
          border: 1px solid #EBEEF5;
          margin-right: 10px;
          box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
          cursor: pointer;
          border-radius: 5px;

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
    width: 32px;
    height: 32px;
    border-radius: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgba(138,138,142,1);
    box-shadow: 1px 1px 5px 5px #e4e7ed;
    cursor: pointer;
    top: 114px;
    opacity: 0.5;
    transition: opacity 0.5s,visibility 0.5s;

    img {
      width: 32px;
      height: 32px;
    }

    &:hover {
      opacity: 1.0;
    }
  }

  .teammark-scroll-left {
    left: 0;
  }

  .teammark-scroll-right {
    right: 0;
  }

  .teammark-search-newversion {
    background: rgba(250,250,251,1);
    height: 284px;
    position: absolute;
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
</style>
