# select multiple 自定义多选框、多选窗口

support select multiple option and support single select option .

use javascript .


使用原声js封装，使用很简单，需要配置简单的参数，下面是使用方法：
	
   ```
   <div>
		<!-- 如果需要多选，则需要在select添加属性 'multiple', 默认是单选 -->
		<!-- 下面是多选，如果是单选则去掉属性 'multiple' -->

		<select id="test_select" multiple>
			<option value="a">a</option>
			<option value="b">b</option>
			<option value="c">c</option>
			
			<!-- 如果 option 的 'selected' 属性为 'selected' 时，会默认选中状态。例如下面： -->
			<!-- <option value="e" selected="selected">e</option>-->
			
			<!-- 当单选时，多个 option 的 'selected'属性为 'selected' 时，默认展示最后一个 -->
		</select>
   <div>
   <button onclick="_getResult()">查看选择结果</button>
   
   <script src="select.js" type="text/javascript" charset="utf-8"></script>
   <script type="text/javascript">
		var test_select = ""
			
		window.onload = function() {
			// 初始化，第一个参数可以是 class 或 id
			test_select = new Selectize("#test_select")
		}
		
		function _getResult() {
			// 获取选择的结果，已数组 [1,2,3,4...] 形式返回
			var result = test_select.getSelect()
			alert(result)
		}
		
		// 使用详情可查看体验 index.html 文件
   </script>
   ```
   
## 更新记录
### 2021.11.14：
	- 1.1.0
	- 优化个别UI展示问题
	- 初始化后可默认展示历史选择过的（详情看文档或是使用index.html体验）

### 2021.11.13：
	- 1.0.0
	- 支持单选、多选
	- 可以输出选择的结果
