/*
			 
 * 
 * html:
 * 
 * <div> 
 *     <select id="testSelect" multiple>
 *         <option value="1">1</option>
 *     </select>
 * <div>
 * 1、需要有 select option 的html组合 !!!!!!!!!!!!!!!!!!!!!!!
 * 2、如果需要多选，则需要在select添加属性 'multiple', 默认是单选
 * 3、需要把 select 放在一个单独的盒子里(例：div)，如果不放，默认会找其父级元素，然后会在里面添加自定义的元素
 * 
 * js:
 * 
 * 创建：var selecter = new Selectize(id_or_class)  // id_or_class: class 或 id
 * 
 * 获取选择的数据：selecter.getSelect()  // 已数组 [1,2,3,4...] 形式返回
 * 
 * */

function Selectize(ele) {
	this.init(ele)
}

Selectize.prototype = {
	init: function(ele) {
		if (!ele || ele.length == 0) {
			console.error("select is not found")
			return false
		}

		this._ele = ele // class 或 id
		this._timeName = new Date().getTime()
		this._eleDom = document.querySelector(ele)
		this._startName = this.getSelectName()
		this._clickSave = ""

		if (!this._ele || this._ele.length == 0) {
			console.error("select is not found")
			return false
		}

		if (!this._eleDom || this._eleDom.length == 0) {
			console.error("select is not found")
			return false
		}

		// 是否多选
		this._isMultiple = this._eleDom.getAttribute("multiple") !== null

		// 选择框
		this._selectViewId = this._startName + "_" + this._timeName + '_select_value_view'
		this._selectViewLiClickFunName = this._startName + "_" + this._timeName + '_select_li_click'

		// 选择框 ul
		this._selectViewUlId = this._startName + "_" + this._timeName + '_select_value_view_ul'

		// 搜索框
		this._searchViewId = this._startName + "_" + this._timeName + '_search_view'
		this._searchViewClickFunName = this._startName + "_" + this._timeName + '_search_view_click'

		// 搜索框 ul
		this._searchViewUlId = this._startName + "_" + this._timeName + '_search_view_ul'

		// 搜索框的输入框
		this._searchInputId = this._startName + "_" + this._timeName + '_search_input_view'
		this._searchInputChangeFunName = this._startName + "_" + this._timeName + '_search_input_change'
		// this._searchInputOnBlurFunName = this._startName + "_" + this._timeName + '_search_input_on_blur'

		// 删除按钮
		this._closeSpanClickFunName = this._startName + "_" + this._timeName + '_close_view_fun'
		this._closeSpan = '<span onclick="' + this._closeSpanClickFunName + '(this, event)">× </span>'

		this._selectClickedClass = "select_value_selected"

		this.startLoad()
	},
	startLoad: function() {
		this.initStyle()
		this.initSelect()
		this.initCustomClassList()
	},
	initSelect: function() { // 获取select里的option，动态创建 ul li
		var children = this._eleDom.children,
			html = "",
			startHtml = '<div class="select_value_view" id="' + this._selectViewId + '"><ul class="select_value_ul" id="' +
			this._selectViewUlId + '">',
			endHtml = '</ul></div>'

		html += startHtml
		for (var i = 0; i < children.length; i++) {
			var item = children[i],
				tmpl = '<li data-value="' + item.getAttribute("value") + '" onclick="' + this._selectViewLiClickFunName +
				'(this)" data-index="' + i + '">' + item.innerHTML + '</li>'

			html += tmpl
		}

		html += endHtml

		this._eleDom.style.display = "none"
		this.initSearchInput(html)
		this.initSelectLiClick()
	},
	initSelectLiClick: function() {
		var _self = this
		// 动态点击效果和取消效果
		window[this._selectViewLiClickFunName] = function(that) {
			_self.clickSaveEvent()
			_self.selectLiClick(that)
		}
	},
	selectLiClick: function(that) {
		var _self = this,
			classLists = that.classLists, // 所有的class
			searchInput = document.querySelector("#" + _self._searchInputId), // input 
			searchUl = document.querySelector("#" + _self._searchViewUlId), // ul
			children = searchUl.children, // ul li
			innerHTML = that.innerHTML,
			dataValue = that.getAttribute("data-value"),
			dataIndex = parseInt(that.getAttribute("data-index") || 0),
			selectValueList = document.querySelector("#" + _self._selectViewId), // select view
			searchViewUl = document.querySelector("#" + _self._selectViewUlId), // select view ul
			valueList = searchViewUl.children // select view ul li

		if (classLists.contains(_self._selectClickedClass)) {
			remove()
			classLists.remove(_self._selectClickedClass);
		} else {
			add()
			classLists.add(_self._selectClickedClass);
		}

		// 如果是单选，会隐藏 select view
		if (!_self._isMultiple) {
			selectValueList.style.display = "none"
		}

		_self.resetSearchInput()

		// 移除搜索框里已有的li
		function remove() {
			for (var i = 0; i < children.length; i++) {
				var item = children[i],
					html = item.innerHTML,
					sliceHtml = html.slice(_self._closeSpan.length, html.length)

				if (sliceHtml == innerHTML && item.getAttribute("data-value") == dataValue) {
					searchUl.removeChild(item)
					break;
				}
			}
		}

		// 向搜索框里添加li
		function add() {
			var newLi = document.createElement("li")

			newLi.setAttribute("data-value", dataValue)
			newLi.setAttribute("data-index", dataIndex) // 排序

			// 阻止冒泡事件
			newLi.onclick = function(that) {
				that.stopPropagation()
			}

			newLi.innerHTML = _self._closeSpan + innerHTML


			if (!_self._isMultiple && searchUl.children.length >= 2) {
				replace()
			}

			searchUl.insertBefore(newLi, getLastPartner())
		}

		// 不是多选时，替换第一个
		function replace() {
			// 删除第一个
			searchUl.removeChild(children[0])

			for (var i = 0; i < valueList.length; i++) {
				var item = valueList[i],
					classList = item.classList

				if (classList.contains(_self._selectClickedClass)) {
					classList.remove(_self._selectClickedClass)
				}
			}
		}

		// 按顺序插入
		function getLastPartner() {
			var last = ""

			for (var i = 0; i < children.length; i++) {
				var item = children[i],
					index = parseInt(item.getAttribute("data-index") || 0),
					hasBig = false

				if (index > dataIndex) {
					hasBig = true
					last = item
					break;
				}
			}
			return hasBig ? last : searchInput.parentNode
		}
	},
	getSelect: function() { // 获取选中的结果，以数组形似返回。
		var _self = this

		if (!this._eleDom || this._eleDom.length == 0) {
			console.warn("select init error, result is empty")
			return false
		}

		var searchUl = document.querySelector("#" + _self._searchViewUlId), // ul
			children = searchUl.children,
			result = []

		if (children.length <= 1) {
			return result
		}

		for (var i = 0; i < children.length - 1; i++) {
			var item = children[i],
				value = item.getAttribute("data-value")

			result.push(value)
		}

		return result
	},
	initSearchInput: function(selectHtml) { // 输入框
		var view = '<div class="select_view" id="' + this._searchViewId + '" onclick="' + this._searchViewClickFunName +
			'(event)">' +
			'<ul class="select_search_ul" id="' + this._searchViewUlId + '">' +
			'<li class="select_search_li_input"><input type="text" id="' + this._searchInputId +
			'" class="select_search_input" oninput="' + this._searchInputChangeFunName + '(this)"/></li></ul></div>'

		this._eleDom.parentNode.innerHTML += (view + selectHtml)

		var _self = this,
			changeTimer = "",
			lastValue = ""

		// 初始化select view的点击事件
		window[this._searchViewClickFunName] = function(e) {
			var selectView = document.querySelector("#" + _self._selectViewId), // select view
				isShow = selectView.style.display == "block",
				searchInput = document.querySelector("#" + _self._searchInputId) // input

			_self.clickSaveEvent()
			selectView.style.display = "block"
			searchInput.focus()
		}

		// 监听页面的其他点击事件，不符合预期的会关闭value list 窗口
		document.addEventListener("click", function() {
			setTimeout(start, 100)

			function start() {
				if (!_self._clickSave) {
					var selectView = document.querySelector("#" + _self._selectViewId),
						searchInput = document.querySelector("#" + _self._searchInputId)

					// 清空输入框内容
					searchInput.value = ""

					// 隐藏value list 窗口
					if (selectView.style.display != "none") {
						selectView.style.display = "none"
					}
				}
			}
		})

		// 初始化搜索框输入内容改变
		window[this._searchInputChangeFunName] = function(ele) {
			var searchValue = ele.value.trim(),
				selectView = document.querySelector("#" + _self._selectViewId),
				searchViewUl = document.querySelector("#" + _self._selectViewUlId), // ul
				valueList = searchViewUl.children // ul下的li

			if (!searchValue && !lastValue) {
				console.warn("search value is empty")
				return false;
			}

			// 兼容删除输入内容后再删除无法回到所有列表
			lastValue = searchValue

			changeWidth()

			clearTimeout(changeTimer)
			changeTimer = setTimeout(function() {
				resolve()
			}, 300)

			function resolve() {
				selectView.style.display = "block"

				for (var i = 0; i < valueList.length; i++) {
					var item = valueList[i]
					if (item.innerHTML.indexOf(searchValue) >= 0) {
						item.classLists.remove("select_search_hide")
					} else {
						item.classLists.add("select_search_hide")
					}
				}
			}

			// 修改宽度，避免出现搜索文字被覆盖
			function changeWidth() {
				var canvas = document.createElement("canvas"),
					ctx = canvas.getContext("2d"),
					width = (ctx.measureText(searchValue).width || 0) + 25;

				ctx.font = "14px Arial"

				ele.style.width = width + "px"
				ele.parentNode.style.width = width + "px"
			}
		}

		// 删除按钮
		window[this._closeSpanClickFunName] = function(ele, event) {
			event.stopPropagation()

			var parent = ele.parentNode,
				grandParent = parent.parentNode,
				dataValue = parent.getAttribute("data-value"),
				selectView = document.querySelector("#" + _self._selectViewUlId),
				liList = selectView.children

			grandParent.removeChild(parent)

			// 重置操作
			for (var i = 0; i < liList.length; i++) {
				var item = liList[i]
				if (item.getAttribute("data-value") == dataValue) {
					item.classLists.remove(_self._selectClickedClass)
					break;
				}
			}

		}
	},
	resetSearchInput: function() { // 点击后重置input
		var searchInput = document.querySelector("#" + this._searchInputId),
			searchViewUl = document.querySelector("#" + this._selectViewUlId), // ul
			valueList = searchViewUl.children

		searchInput.value = ""

		for (var i = 0; i < valueList.length; i++) {
			var item = valueList[i]
			if (item.classLists.contains("select_search_hide")) {
				item.classLists.remove("select_search_hide")
			}
		}
	},
	initStyle: function() { // 自定义style
		var styleText =
			'.select_view{width:100%;height:auto;overflow:hidden;border:1px solid black}.select_search_ul{width:100%;height:auto;list-style:none;padding:0 5px;box-sizing:border-box;}.select_search_ul li{float:left;border-color:#367fa9;padding:0 5px;margin:5px 5px;background-color:#e4e4e4;border:1px solid #aaa;border-radius:4px;color:#333;font-size:14px;box-sizing:border-box}.select_search_ul li span{font-size:10px;height:100%;padding:0 5px;color:#999;cursor:pointer;display:inline-block;font-weight:bold}.select_search_ul li span:hover{color:black}.select_search_li_input{background-color:transparent!important;width:10px;border-color:transparent!important;width:50px}.select_search_li_input::after{clear:right}.select_search_input{width:25px;outline:0;border:0;background-color:transparent}.select_value_view{display:none;width:100%;position:relative}.select_value_ul{padding-left:0;list-style:none;width:100%;height:200px;background-color:white;border:1px solid #aaa;box-sizing:border-box;overflow-y:auto;position:absolute;top:0;left:0;z-index:99}.select_value_ul li{padding:6px 12px;cursor:pointer;font-size:14px}.select_value_ul li:hover{background-color:#5897fb;border-color:#367fa9;color:white}.select_value_selected{background-color:#ddd;color:#444}.select_search_hide{display:none}'
		var head = document.getElementsByTagName("head")[0],
			style = document.createElement("style");

		style.type = "text/css";
		style.className = "__custom_select_y"

		var styleEle = document.querySelector(".__custom_select_y")

		// 如果已经存在了就不再创建了
		if (styleEle) {
			return false
		}

		try {
			style.appendChild(document.createTextNode(styleText));
		} catch (ex) {
			style.styleSheet.cssText = styleText; //针对IE
		}

		var head = document.getElementsByTagName("head")[0];

		head.appendChild(style);
	},
	getSelectName: function() { // 截取名字，做自定义id
		var name = ""
		if (this._ele.indexOf("#") >= 0 || this._eleDom.indexOf(".") >= 0) {
			name = this._ele.slice(1, this._ele.length)
		}

		return name
	},
	clickSaveEvent: function() { // 兼容点击事件
		var _self = this
		_self._clickSave = true
		setTimeout(function() {
			_self._clickSave = ""
		}, 200)
	},
	initCustomClassList: function() { // 兼容classList，自定义 classLists
		var isClsList = 'classLists' in HTMLElement.prototype;
		if (!isClsList) {
			Object.defineProperty(HTMLElement.prototype, 'classLists', {
				get: function() {
					// add, remove ,contains,toggle
					// this  - > 
					var _self = this;
					return {
						add: function(cls) {
							if (!this.contains(cls)) {
								_self.className += ' ' + cls;
							}
						},
						remove(cls) {
							if (this.contains(cls)) {
								var reg = new RegExp(cls);
								_self.className = _self.className.replace(reg, '');
							}
						},
						contains(cls) {
							var index = _self.className.indexOf(cls);
							return index != -1 ? true : false;
						},
						toggle(cls) {
							if (this.contains(cls)) {
								this.remove(cls)
							} else {
								this.add(cls)
							}
						}
					}
				}
			})
		}
	}
}
