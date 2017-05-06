
$(function(){




    function getDateList(dateObj){

        if( !(dateObj instanceof Date) ) console.error('this arguments is error')

        var target = dateObj,
            time = target.getTime(),
            year = target.getFullYear(),
            month = target.getMonth()+1,
            day = target.getDay(),
            date =  target.getDate()

        var now = new Date(),
            nowYear = now.getFullYear(),
            nowMonth = now.getMonth()+1,
            nowDate = now.getDate()

        var isThisMonth = nowYear == year && nowMonth == month ? true : false


        function TestLeapYear(y) //计算闰年
        {
            return Number(y)%4 ? false : true
        }

        function getMonthCountDates(m,y) //计算月份天数
        {
            var count = 0;
            if(m==1 || m==3 || m==5 || m==7 || m==8 || m==10 || m==12 )
            {
                count = 31
            }
            else if( m==4 || m==6 || m==9 || m==11 )
            {
                count = 30
            }
            else
            {
                count = TestLeapYear(y) ? 29 : 28
            }
            return count
        }

        function getMonthStarDate(m,y) //获取此月第一天
        {
            return new Date( y , m-1 , 1 )
        }

        function getMonthEndDate(m,y) //获取此月最后一天
        {
            return new Date( y , m-1 , getMonthCountDates(m,y) )
        }

        function getPrevSurplusDates(n) //获取上个月剩余天数,需要补齐n天
        {
            var list = []
            var s = getMonthStarDate(month,year) .getTime()
            var p = new Date( s-86400000 ), //上个月最后一天
                y = p.getFullYear(),
                m = p.getMonth()+1,
                de = p.getDate(),
                d = p.getDay()

            while( n > 0 )
            {
                de --
                d --
                list.unshift({
                    date : de+1,
                    currentMonth : false,
                    day : formatDay( d+1 ),
                    t : y + '/'+ m + '/' + (de+1)
                })
                n --
            }

            return list
        }

        function getNextSurplusDates(n)  //获取下个月起始天数,需补齐n天
        {
            var list = []
            var e = getMonthEndDate( month , year ).getTime()
            var ne = new Date( e + 86400000 ) //下个月第一天
            y = ne.getFullYear(),
                m = ne.getMonth()+1,
                de = ne.getDate(),
                d = ne.getDay()

            for(var i=0;i<n;i++)
            {
                de++
                d++
                list.push({
                    date : de-1,
                    currentMonth : false,
                    day : formatDay( d-1 ),
                    t : y + '/' + m + '/' + (de-1)
                })
            }

            return list
        }

        function formatDay(number)  //格式化星期
        {
            var week;
            switch (number)
            {
                case 0:
                    week = '星期日'
                    break;
                case 1:
                    week = '星期一'
                    break;
                case 2:
                    week = '星期二'
                    break;
                case 3:
                    week = '星期三'
                    break;
                case 4:
                    week = '星期四'
                    break;
                case 5:
                    week = '星期五'
                    break;
                case 6:
                    week = '星期六'
                    break;
            }
            return week
        }

        function createMonthList(y,m,d) //数据构造器
        {
            var list = [],
                dateCount = getMonthCountDates(m,y) ,
                starDay = getMonthStarDate(m,y).getDay(),
                endDay = getMonthEndDate(m,y).getDay(),
                currentDay = starDay - 1

            //组装上个月的list
            if( starDay > 0 )
            {
                list = getPrevSurplusDates(starDay)
            }


            //组装本月的list
            for( var i=0; i < dateCount ; i++ )
            {
                currentDay = currentDay +1

                if( currentDay == 7 ) { currentDay = 0 }

                list.push({
                    date : i+1,
                    currentMonth : true,
                    currentDate : isThisMonth && nowDate == i+1 ? true : false,
                    day :  formatDay(currentDay),
                    t : year + '/' + month + '/' + (i+1)
                })
            }

            //组装下个月的list
            if( endDay < 6 )
            {
                list = list.concat( getNextSurplusDates( 6 - endDay ) )
            }

            return list
        }

        return createMonthList( year , month , day )
    }

    Vue.component('component-pop', {
        props : {
            position : {
                type : Array,
                default : [0,0]
            },
            size : {
                type : Array,
                default : function(){
                    return [380,240]
                }
            },
            options : {
                type : [String, Object]
            }
        },
        data : function(){
            return {
                msg : 'aaa'
            }
        },
        computed : {
            posX : function(){
                return this.position[0] - this.size[0]/2 + 18
            },
            posY : function(){
                return this.position[1] - this.size[1] -16
            }
        },
        template : `<transition name="fade">
                        <div class="pop-warp" v-bind:style = "{ left :  posX +'px', top : posY +'px',width : this.size[0] + 'px' , height : this.size[1] + 'px'}">
                            <div class="pop-box">
                                <div class="pop-up">
                                    <div class="img-warp">
                                        <img src="http://img.hb.aicdn.com/5cc1a139b61f38d601f225fa28c31f9bdd78b93e51682-9WNgIO_fw658">
                                    </div>
                                </div>
                                <div class="pop-dowm">
                                    <div class="msg-warp">
                                        <div class="weather-box">
                                            <img src="../../public/images/weather.png" alt="">
                                        </div>
                                        <dl>
                                            <dt></dt>
                                            <dd></dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <i class="arrow"></i>
                        </div>
                    </transition>`
    })

    Vue.component('component-calendar',{
        props : ['dateObj'],
        data : function(){
            return {
                tmpDateObj : null,
                fadeUpCls : false,
                fadeDownCls : false,
                targetFocus : false,
                eventOption : null
            }
        },
        watch : {
            dateObj : function( newValue , oldValue ){

                var _this = this;

                oldValue.getTime() > newValue.getTime() ? this.fadeUpCls = true : this.fadeDownCls = true

                _.delay(function() {
                    _this.tmpDateObj = _this.dateObj
                }, 200, 'later')

                _.delay(function() {
                    _this.fadeUpCls = false
                    _this.fadeDownCls = false
                }, 400, 'later')
            }
        },
        computed : {
            serializeDates : function(){
                var dateList = getDateList( this.tmpDateObj || this.dateObj )

                var result = []
                var tem = []
                var len = dateList.length
                dateList.forEach(function(item,index){
                    tem.push( item )
                    if( !((index+1)%7) && index )
                    {
                        result.push( tem )
                        tem = []
                    }
                })
                return result
            }
        },
        methods : {
            doFocus : _.debounce( function(opt,e){
                if( opt === 'on' )
                {
                    this.$emit('over', e )
                }
                if( opt === 'off' )
                {
                    this.$emit('leave', e )
                }
                this.eventOption = e
            }, 300 ),
            doActive : function(e){
                this.$emit('active')
            }

        },
        template : ` <div class="calendar-warp" >
                        <div class="calendar-header">
                            <div class="calendar-header-col"><span class="calendar-bar">日</span></div>
                            <div class="calendar-header-col"><span class="calendar-bar">一</span></div>
                            <div class="calendar-header-col"><span class="calendar-bar">二</span></div>
                            <div class="calendar-header-col"><span class="calendar-bar">三</span></div>
                            <div class="calendar-header-col"><span class="calendar-bar">四</span></div>
                            <div class="calendar-header-col"><span class="calendar-bar">五</span></div>
                            <div class="calendar-header-col"><span class="calendar-bar">六</span></div>
                        </div>
                        <div class="calendar-box">
                             <table class="calendar-table" v-bind:class="{ calendarFadeUp : fadeUpCls , calendarFadeDown : fadeDownCls }">
                                <tr v-for="week in serializeDates">
                                    <td v-for="day in week">
                                            <div class="date-warp">
                                                <div class="date-main">
                                                    <span class="date-num" 
                                                        :class="{ 'data-gary' : !day.currentMonth , 'date-active' : day.currentDate }" 
                                                        @mouseenter="doFocus('on',$event)" @mouseleave="doFocus('off',$event)" @click="doActive($event)">
                                                        {{day.date}}
                                                    </span>
                                                </div>
                                                <div class="date-down">
                                                    <p class="extra-infor"><span class="lunar-calender">{{ day.lunar }}</span></p>
                                                    <p class="guide-warp">
                                                        <i class="guide-bar"></i>
                                                        <i class="guide-bar green"></i>
                                                        <i class="guide-bar blue"></i>
                                                    </p>
                                                </div>
                                            </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                      </div>`,
    })

    Vue.component('component-dialog',{
        props : {
            show : {
                type : Boolean,
                default : true
            },

        },
        computed : {
            dialogShow : function(){
                return this.show
            }
        },
        methods : {
            close : function(){
                this.$emit('close')
                this.dialogShow = false
            }
        },
        "template" : `<transition name="slide">
                        <div class="layer" v-show="dialogShow" @click="close" >
                            <div class="layer-modal" @click.stop="">
                                <div class="model-header">
                                    <h1 class="model-title">标题</h1>
                                    <i class="model-close" @click="close">&#xe602;</i>
                                </div>
                                <div class="model-body">
                                    <div style="height:1000px">4897</div>
                                </div>
                                <div class="model-footer">
                                    <input type="button" class="btn-default" value="确定">
                                    <input type="button" class="btn-primary" value="确定">
                                </div>
                            </div>
                        </div>
                     </transition>`
    })

    Vue.component('component-aside',{
        props : {
            show : {
                type : Boolean,
                default : true
            },
            width : {
                type : Number,
                default : 500
            }
        },
        methods : {
            close : function(){
                this.$emit('close')
            }
        },
        template : `<transition name="sideslip">
                        <div class="aside" v-show="show" v-on:click="close">
                            <div class="aside-model" v-on:click.stop="" v-bind:style="{ width:width+'px' }">
                                <div class="aside-model-header">
                                    aaaaaa
                                </div>
                                <div class="aside-model-body">
                                    <div style="height:1000px">waegweag</div>
                                </div>
                            </div>
                        </div>
                    </transition>`
    })

    Vue.component('component-jumbotron',{
        props : ['jumbotronShow'],
        template : `<div class="jumbotron" v-if="jumbotronShow">
            <div class="jumbotron-warp">
                <i class="dec"></i>
                <i class="dec"></i>
                <div class="jumbotron-modal">
                    <div class="jumbotron-header">
                        <div class="tool fr">
                            <i class="icon">&#xe606</i>
                        </div>
                    </div>
                    <div class="jumbotron-body">
                        <div style="height:1800px">
                            afwe
                        </div>
                    </div>
                    <div class="jumbotron-footer">
                        footer
                    </div>
                </div>
            </div>
        </div>`
    })

    var app = new Vue({
        el : '#index',
        data : {
            dateObj : new Date(),
            calendarOnFocus : false,
            popPosition : [10,10],
            popMsg : 'bbb',
            popShow : false,
            dialogShow : false,
            asideShow : false,
            jumbotronShow : false
        },
        created : function(){
            var _this = this

            //键盘事件
            document.onkeydown = function(event) {

                var e = event || window.event || arguments.callee.caller.arguments[0];

                if(e && e.keyCode==40){ // 按 下
                    _this.nextDate()
                }
                if(e && e.keyCode==38){ // 按 上
                    _this.prevDate()
                }

            }

        },
        methods : {
            bindMouseEvent : function(){
                var _this = this
                if(document.addEventListener){
                    document.addEventListener('DOMMouseScroll', _.debounce( _this.scrollFn , 300 )  ,false );
                }

                window.onmousewheel = document.onmousewheel = _.debounce( _this.scrollFn , 300 )
            },
            unbindMmouseEvent : function(){
                console.log('unbind')
                var _this = this
                if(document.addEventListener){
                    document.removeEventListener('DOMMouseScroll', _.debounce( _this.scrollFn , 300 )  ,false );
                }

                window.onmousewheel = document.onmousewheel = function(){}
            },
            scrollFn : function(e){

                if( !this.calendarOnFocus ) return false

                if( e.deltaY > 0 )
                {
                    this.nextDate()
                }
                else
                {
                    this.prevDate()
                }

            },
            prevDate : function(){
                var y = this.year,
                    m = this.month - 1

                if( m <= 0 )
                {
                    m = 12
                    y = y-1
                }

                this.dateObj = new Date( y+'/'+ m +'/'+1 )
            },
            nextDate : function(){
                var y = this.year,
                    m = this.month + 1

                if( m >= 13 )
                {
                    m = 1
                    y = y+1
                }

                this.dateObj = new Date( y+'/'+ m +'/'+1 )
            },
            calendarOver : function(e){

                function getElementLeft(element){
                    var actualLeft = element.offsetLeft;
                    var current = element.offsetParent;
                    while (current !== null){
                        actualLeft += current.offsetLeft;
                        current = current.offsetParent;
                    }
                    return actualLeft;
                }
                function getElementTop(element){
                    var actualTop = element.offsetTop;
                    var current = element.offsetParent;
                    while (current !== null){
                        actualTop += current.offsetTop;
                        current = current.offsetParent;
                    }
                    return actualTop;
                }

                this.popShow = true

                this.popPosition = [ getElementLeft( e.target ) - this.$el.offsetLeft ,  getElementTop( e.target ) - this.$el.offsetTop ]
            },
            calendarLeave : function(e){
                this.popShow = false
            },
            calendarActive : function(){
                this.asideShow = true
            },
            dialogClose : function(){
                this.dialogShow = false
            },
            asideClose : function(){
                this.asideShow = false
            }
        },
        computed : {
            year : function(){ return this.dateObj.getFullYear() },
            month : function(){ return this.dateObj.getMonth()+1 },
            date : function(){ return this.dateObj.getDate() }
        },
        watch : {
            calendarOnFocus : function(){
               this.calendarOnFocus ? this.bindMouseEvent() : this.unbindMmouseEvent()
            }
        }
    })



})
