(function(){
Vue.component('Result',{
  props: ['target'],
  template: `<tr :class="status(target.Status)">
    <td>{{target.County}} - {{target.SiteName}}</td>
    <td>{{target.AQI}}<i v-if="!target.AQI">資料不足</i></td>
    <td>{{target['PM2.5']}}<i v-if="!target['PM2.5']">資料不足</i></td>
    <td><span>{{target.Status}}</span></td>
    <td>{{target.PublishTime}}</td>
    <td>
      <i class="fas fa-star" @click="innerCollct" v-if="target.star"></i>
      <i class="far fa-star" @click="innerCollct" v-else="target.star"></i>
      收藏</td>
  </tr>`,
  methods: {//傳遞key(SiteName)給Vue本體
    innerCollct: function(){
      this.$emit('click',this.target.SiteName)
    },
    innerStatus: function(){
      this.$emit('status',this.target.Status)
    },
    status: function(status){
      if (status == '良好') return 'sta_0'   
      if (status == '普通') return 'sta_1'
      if (status == '對敏感族群不健康') return 'sta_2'
      if (status == '對所有族群不健康') return 'sta_3'
      if (status == '非常不健康') return 'sta_4'
      if (status == '危害') return 'sta_5'
      if (status == '設備維護') return 'sta_6'
    }
  }
})
var app = new Vue({
  el: '#app',
  data: {
    data:[],
    target: '--請選擇縣市--',
    storageArray: []
  },
  created: function() {
    this.getData();
  },
  methods: {
    getData: function(){
      const vm = this
      const apiUrl ='http://opendata2.epa.gov.tw/AQI.json'
      $.get(apiUrl).then(response=>{
        response.forEach(item=>{
          item['star']=false //新增一個資料屬性提供加星號使用
        })
        vm.data = response
      })
    },
    outerCollct: function(key){
      const vm = this
      const startarget = vm.data.find(city=>city.SiteName===key)
      startarget.star = !startarget.star
      
      //取出有星星的地名
      vm.storageArray = vm.hasStar.map((item)=>item.SiteName)
      localStorage.setItem('item', JSON.stringify(vm.storageArray))
      let mySaveCity = JSON.parse(localStorage.item)
      console.log(mySaveCity)   
    },
    clearStar: function(){
      this.data.forEach((item)=>{
        item.star = false
      })
      localStorage.clear()
    }
  },
  computed:{
    myCity: function(){
      const vm = this
      const setCity = new Set(vm.data.map((item) => item.County ))
      return [...setCity]
    },
    filterCity: function(){
      const vm = this
      return vm.data.filter((item)=>{
        return vm.target==='--請選擇縣市--' ?  item : item.County === vm.target
      })
    },
    hasStar: function(){
      const vm = this
      const hasStar = vm.data.filter((item)=>{
        return item.star
      })
      return hasStar
    }
  }

})

})()