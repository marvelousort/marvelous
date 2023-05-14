$(function () {

    // 首页轮播
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal', // 垂直切换选项
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },
        autoplay: true,
    });

    // 二级导航动态调整
    (function () {
        var strs = ["找攻略", "看游记", "问达人", "头脑学园", "酒店", "去旅行", "机票", "当地玩乐",];
        var colors = ["ff9d00", "feca2b", "42d6ba", "f94a87", "32a2f1", "fd4e4e", "acce0e", "b160df",];
        var urls = ["https://m.mafengwo.cn/mdd/", "https://w.mafengwo.cn/trans_flight_lpc/index.html", "/mdd/", "/mdd/", "/mdd/", "/mdd/", "/mdd/", "/mdd/"];
        var str = "";
        for (var i = 0; i < strs.length; i++) {
            str += `<div class="item">
                <a href="${urls[i]}">
                    <div class="item-img"></div>
                    <p style='color:#${colors[i]}'>${strs[i]}</p>
                </a>
            </div>`;
        }
        $(".nav").html(str);
    })();

    // 请求第一页的数据。
    function getPageData(page) {
        $.ajax({
            beforeSend: function () {
                showLoading();
            },
            url: "./php/mafengwo.php",
            data: {
                page: page
            },
            dataType: "json",
            type: "get",
            success: function (res) {
                resolvePageData(res);
            },
            complete: function () {
                //，隐藏loading动画。
                hideLoading();
            }
        });
    }

    getPageData(0);

    function resolvePageData(res) {
        console.log(res.page, res);
        var showMore = res.show_more;
        if (!showMore) {
            $(".more").html(">>>>我们也是有底线的");
            return;
        }
        // 将下一页的页码数作为属性添加到 more 元素上。点击获取更多。
        $(".more").prop("page", res.page);

        // console.log(res.data.list);
        var dataArr = res.data.list;
        var str = "";
        for (var i = 0; i < dataArr.length; i++) {
            var item = dataArr[i];
            str += `<div class="item">
                    <div class="title">${item.data.title}</div>
                    <div class="content">
                        <img src=${item.data.image} alt="">
                        <div class="info">
                            <div class="desc">${item.data.content}</div>
                            <div class="see">${item.data_source.pv}浏览</div>
                            <div class="user-info">
                            <span>${item.data.bottom.user.name}</span>
                            <img src=${item.data.bottom.user.logo} alt=""></div>
                        </div>
                    </div>
                    <hr>
                </div>`;
        }
        // 
        $(".list").append(str);
        loading = false;

    }

    // 点击加载更多。
    $(".more").on("click", function () {
        nextPageData();
    });

    function nextPageData() {
        loading = true;
        var $more = $(".more");
        // 获取下一页的页码数
        var page = $more.prop("page");
        // 如果没有更多的数据了，不应该再次发送请求。
        if ($more.html().includes("底线")) {
            return;
        }
        getPageData(page);
    }

    function showLoading() {
        $(".loading").css("display", "block");
    }
    function hideLoading() {
        $(".loading").css("display", "none");
    }

    var loading = false;
    // 上滚加载更多
    $(window).on("scroll", function () {
        // 当数据加载的时候不要再次请求数据
        if (loading)
            return;
        if ($(document.body).height() - $(window).scrollTop() - $(window).height() <= 100) {
            nextPageData();
        }
    });

});