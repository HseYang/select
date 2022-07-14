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
		var test_select = "",
			opt =  {
				inoperable: false,  // 默认 false ；如果为 true 时，不可选择，也不能删除
				deleteCallBack: deleteCallBack, // 删除成功后的回调
				selectedCallBack: selectedCallBack // 选择成功后的回调
			}
			
		window.onload = function() {
			// 初始化，第一个参数可以是 class 或 id
			//        第二个参数是 配置项，可看上面的 opt
			test_select = new Selectize("#test_select", opt)
		}
		
		function _getResult() {
			// 获取选择的结果，已数组 [1,2,3,4...] 形式返回
			var result = test_select.getSelect()
			alert(result)
		}
		
		function deleteCallBack(deleteVal){
			// 删除后，回调删除的数据
			console.log("deleteCallBack deleteVal", deleteVal)
		}
		
		function selectedCallBack(selectVal){
			// 选择后，回调选择的数据
			console.log("selectedCallBack selectVal", selectVal)
		}
		
		// 使用详情可查看体验 index.html 文件
   </script>
   ```
   
## 更新记录
### 2022.7.14：
	- 1.2.0
	- 选择框增加最大高度，防止内容太多，盒子无限大
	- 增加 不可选择，也不能删除 的 inoperable 参数
	- 增加 删除成功后的回调
	- 增加 选择成功后的回调
	- 增加 select的class属性会自动填充到 新创建的选择框上


### 2021.11.14：
	- 1.1.0
	- 优化个别UI展示问题
	- 初始化后可默认展示历史选择过的（详情看文档或是使用index.html体验）

### 2021.11.13：
	- 1.0.0
	- 支持单选、多选
	- 可以输出选择的结果
