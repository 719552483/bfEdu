package com.beifen.edu.administration.controller;


import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;

import javax.servlet.http.HttpServletResponse;


import org.apache.poi.EncryptedDocumentException;

import org.apache.poi.openxml4j.exceptions.InvalidFormatException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;


import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu103;
import com.beifen.edu.administration.domian.Edu104;
import com.beifen.edu.administration.domian.Edu105;
import com.beifen.edu.administration.domian.Edu106;
import com.beifen.edu.administration.domian.Edu107;
import com.beifen.edu.administration.domian.Edu108;
import com.beifen.edu.administration.domian.Edu200;
import com.beifen.edu.administration.domian.Edu300;
import com.beifen.edu.administration.domian.Edu301;
import com.beifen.edu.administration.service.AdministrationPageService;
import com.beifen.edu.administration.utility.ReflectUtils;

/*
 * 业务处理Controller测试
 * */
@Controller
public class AdministrationController {

	@Autowired
	private AdministrationPageService administrationPageService;
	ReflectUtils utils = new ReflectUtils();

	/**
	 * 查询二级代码信息
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("getEJDM")
	@ResponseBody
	public Object getEJDM() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu000> queruRs = administrationPageService.queryEjdm();
		// 将查询出的二级代码库集合用key分组
		// 初始化一个map
		Map<String, List<Edu000>> map = new HashMap<>();
		for (Edu000 edu000 : queruRs) {
			String key = edu000.getEjdmglzd();
			if (map.containsKey(key)) {
				// map中存在以此id作为的key，将数据存放当前key的map中
				map.get(key).add(edu000);
			} else {
				// map中不存在以此id作为的key，新建key用来存放数据
				List<Edu000> userList = new ArrayList<>();
				userList.add(edu000);
				map.put(key, userList);
			}
		}
		returnMap.put("allEJDM", map);
		boolean result;
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 用户登录查询
	 * 
	 * @param username用户名
	 * 
	 * @param password密码
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/verifyUser")
	@ResponseBody
	public Object verifyUser(@RequestParam String username, @RequestParam String password) {
		boolean result = false; // 密码验证结果
		Map<String, Object> returnMap = new HashMap();
		String checkIsHaveUser = administrationPageService.checkIsHaveUser(username);
		String datebasePwd = administrationPageService.checkPwd(username);
		// 用户不存在
		if (checkIsHaveUser == null) {
			result = false;
			returnMap.put("result", result);
		} else if (!password.equals(datebasePwd)) {
			result = false;
			returnMap.put("result", result);
		} else if (checkIsHaveUser != null && password.equals(datebasePwd)) {
			result = true;

			Map<String, Object> UserInfo = new HashMap();
			Edu990 edu000 = administrationPageService.getUserInfo(username);
			returnMap.put("UserInfo", JSON.toJSONString(edu000));
			returnMap.put("result", result);
		}
		return returnMap;
	}

	/**
	 * 课程库新增课程
	 * 
	 * @param addinfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addNewClass")
	@ResponseBody
	public Object addNewClass(@RequestParam("newClassInfo") String addinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(addinfo);
		Edu200 addClassInfo = (Edu200) JSONObject.toBean(jsonObject, Edu200.class);
		List<Edu200> allClass = administrationPageService.queryAllClass();
		// 判断课程名称和代码是否已存在
		boolean nameHave = false;
		boolean codeHave = false;
		for (int i = 0; i < allClass.size(); i++) {
			if(allClass.get(i).getKcmc().equals(addClassInfo.getKcmc())){
				nameHave = true;
				break;
			}
			
			if(allClass.get(i).getKcdm().equals(addClassInfo.getKcdm())){
				codeHave = true;
				break;
			}
		}

		// 不存在则往数据库新增课程
		if (!codeHave && !codeHave) {
			String newClassStatus = "noStatus";
			long currentTimeStamp = System.currentTimeMillis();
			addClassInfo.setLrsj(currentTimeStamp);
			addClassInfo.setZt(newClassStatus);
			administrationPageService.addNewClass(addClassInfo);
			Long id = addClassInfo.getBF200_ID();
			returnMap.put("newId", id);
			returnMap.put("lrsj", currentTimeStamp);
			returnMap.put("zt", newClassStatus);
		}
		returnMap.put("result", true);
		returnMap.put("nameHave", nameHave);
		returnMap.put("codeHave", codeHave);
		return returnMap;
	}

	/**
	 * 课程库修改课程
	 * 
	 * @param addinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("updateClass")
	@ResponseBody
	public Object updateClass(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu200 edu200 = (Edu200) JSONObject.toBean(jsonObject, Edu200.class);
		List<Edu200> allClass = administrationPageService.queryAllClass();
		// 判断课程名称和代码是否已存在
		boolean nameHave = false;
		boolean codeHave = false;
		for (int i = 0; i < allClass.size(); i++) {
			if (!allClass.get(i).getBF200_ID().equals(edu200.getBF200_ID())
					&& allClass.get(i).getKcdm().equals(edu200.getKcdm())) {
				codeHave = true;
				break;
			}

			if (!allClass.get(i).getBF200_ID().equals(edu200.getBF200_ID())
					&& allClass.get(i).getKcmc().equals(edu200.getKcmc())) {
				nameHave = true;
				break;
			}
		}
		returnMap.put("nameHave", nameHave);
		returnMap.put("codeHave", codeHave);
		// 不存在则修改数据
		if (!codeHave && !codeHave) {
			long currentTimeStamp = System.currentTimeMillis();
			edu200.setLrsj(currentTimeStamp);
			edu200.setZt("noStatus");
			administrationPageService.updateClass(edu200);
			returnMap.put("currentTimeStamp", currentTimeStamp);
		}
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 课程库搜索课程
	 * 
	 * @param SearchCriteria搜索条件
	 * @return returnMap
	 */
	@RequestMapping("librarySeacchClass")
	@ResponseBody
	public Object librarySeacchClass(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
		Edu200 edu200 = new Edu200();
		edu200.setKcdm(jsonObject.getString("courseCode"));
		edu200.setKcmc(jsonObject.getString("courseName"));
		edu200.setBzzymc(jsonObject.getString("markName"));
		edu200.setKcxz(jsonObject.getString("coursesNature"));
		edu200.setZt(jsonObject.getString("status"));
		List<Edu200> classList = administrationPageService.librarySeacchClass(edu200);
		returnMap.put("result", true);
		returnMap.put("classList", classList);
		return returnMap;
	}

	/**
	 * 课程库课程更改状态
	 * 
	 * @param modifyInfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("librarymodifyClassByID")
	@ResponseBody
	public Object changeClassStatusById(@RequestParam String modifyInfo) {
		Map<String, Object> returnMap = new HashMap();
		// modifyInfo转json对象
		JSONObject jsonObject = new JSONObject().fromObject(modifyInfo);
		// 获得更改的状态
		String modifyStatus = jsonObject.getString("modifyStatus");
		// 获得更改的课程
		JSONArray classArray = jsonObject.getJSONArray("choosedClasses");
		// 获得审核人id
		Long approvalPersonID = Long.valueOf(jsonObject.getString("approvalPersonID"));
		// 获得审核人
		String approvalPerson = jsonObject.getString("approvalPerson");
		// 获得审核时间戳
		long approvalTime = System.currentTimeMillis();
		
		
		//查询课程是否存在培养计划
		for (int i = 0; i < classArray.size(); i++) {
			boolean notInPlan=administrationPageService.classIsInCurturePlan(classArray.get(i).toString());
			if(notInPlan&&!modifyStatus.equals("pass")){
				returnMap.put("notInPlan", notInPlan);
				returnMap.put("result", true);
				return returnMap;
			}
		}

		
		//不存在修改
		for (int i = 0; i < classArray.size(); i++) {
			administrationPageService.modifyClassById(classArray.get(i).toString(), modifyStatus, approvalPerson,
					approvalPersonID, approvalTime);
		}
		returnMap.put("result", true);
		returnMap.put("approvalTime", approvalTime);
		returnMap.put("notInPlan", false);
		return returnMap;
	}

	/**
	 * 检查删除课程是否有存在培养计划
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("checkCrouseIsInPlan")
	@ResponseBody
	public Object checkCrouseIsInPlan(@RequestParam String deleteIds) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = new JSONObject().fromObject(deleteIds);
		boolean isInPlan;
		// 获得更改的课程
		JSONArray classArray = jsonObject.getJSONArray("deleteIdArray");
		//查询课程是否存在培养计划
		for (int i = 0; i < classArray.size(); i++) {
			isInPlan=administrationPageService.classIsInCurturePlan(classArray.get(i).toString());
			if(isInPlan){
				returnMap.put("isInPlan", isInPlan);
				returnMap.put("result", true);
				return returnMap;
			}
		}
		returnMap.put("result", true);
		returnMap.put("isInPlan", false);
		return returnMap;
	}
	
	
	/**
	 * 删除课程库课程
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("libraryReomveClassByID")
	@ResponseBody
	public Object deleteOperationCodeing(@RequestParam String deleteIds) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = new JSONObject().fromObject(deleteIds);
		// 获得删除的课程
		JSONArray classArray = jsonObject.getJSONArray("deleteIdArray");
	
		for (int i = 0; i < classArray.size(); i++) {
			administrationPageService.removeLibraryClass(classArray.get(i).toString());
		}
		
		returnMap.put("result", true);
		returnMap.put("notInPlan", false);
		return returnMap;
	}
	
	

	/**
	 * 查询所有教师
	 * 
	 * @return returnMap
	 */
	@RequestMapping("queryAllTeacher")
	@ResponseBody
	public Object queryAllTeacher() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu101> teacherList = administrationPageService.queryAllTeacher();
		returnMap.put("result", true);
		returnMap.put("teacherList", teacherList);
		return returnMap;
	}

	/**
	 * 搜索教师
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("searchTeacher")
	@ResponseBody
	public Object SeacchTeacher(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
		Edu101 edu101 = new Edu101();
		edu101.setSsyx(jsonObject.getString("departmentName"));
		edu101.setJsxm(jsonObject.getString("mangerName"));
		edu101.setJgh(jsonObject.getString("mangerNumber"));
		List<Edu101> techerList = administrationPageService.searchTeacher(edu101);
		returnMap.put("techerList", techerList);
		returnMap.put("result", true);
		return returnMap;
	}

	
	
	/**
	 * 获得教务相关公共代码信息
	 */
	@RequestMapping("/getJwPublicCodes")
	@ResponseBody
	public Object getJwPublicCodes() {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("allLevel", administrationPageService.queryAllLevel());
		returnMap.put("allDepartment", administrationPageService.queryAllDepartment());
		returnMap.put("allGrade", administrationPageService.queryAllGrade());
		returnMap.put("allMajor", administrationPageService.queryAllMajor());
		returnMap.put("result", true);
		return returnMap;
	}

	
	
	/**
	 * 获得所有层次关系管理信息
	 */
	@RequestMapping("/getAllRelationInfo")
	@ResponseBody
	public Object getAllRelationInfo() {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("allRelationInfo", administrationPageService.queryAllRelation());
		returnMap.put("result", true);
		return returnMap;
	}

	
	
	/**
	 * 新增层次关系
	 * 
	 * @param newRelationInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addNewRelation")
	@ResponseBody
	public Object addNewRelation(@RequestParam("newRelationInfo") String newRelationInfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(newRelationInfo);
		Edu107 edu107 = (Edu107) JSONObject.toBean(jsonObject, Edu107.class);
		List<Edu107> currentAllRelation = administrationPageService.queryAllRelation();
		// 判断关系是否已存在
		boolean have = false;
		boolean relationNameHave = false;
		for (int i = 0; i < currentAllRelation.size(); i++) {
			if(currentAllRelation.get(i).getPyjhmc().equals(edu107.getPyjhmc())){
				relationNameHave= true;
				break;
			}
			
			if (currentAllRelation.get(i).getPyccbm().equals(edu107.getPyccbm())
					&& currentAllRelation.get(i).getXbbm().equals(edu107.getXbbm())
					&& currentAllRelation.get(i).getNjbm().equals(edu107.getNjbm())
					&& currentAllRelation.get(i).getZybm().equals(edu107.getZybm())) {
				have = true;
				break;
			}
		}
		// 不存在则往数据库新增关系
		if (!have&&!relationNameHave) {
			String yxbz = "1";
			edu107.setYxbz(yxbz);
			administrationPageService.addNewRelation(edu107);
			Long id = edu107.getEdu107_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);

		}

		returnMap.put("result", true);
		returnMap.put("have", have);
		returnMap.put("relationNameHave", relationNameHave);
		return returnMap;
	}

	
	
	
	/**
	 * 修改层次关系
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("updateRelation")
	@ResponseBody
	public Object updateRelation(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu107 edu107 = (Edu107) JSONObject.toBean(jsonObject, Edu107.class);
		List<Edu107> currentAllRelation = administrationPageService.queryAllRelation();
		// 判断关系是否已存在
		boolean have = false;
		boolean relationNameHave = false;
		for (int i = 0; i < currentAllRelation.size(); i++) {
			if(!currentAllRelation.get(i).getEdu107_ID().equals(edu107.getEdu107_ID())&&
					currentAllRelation.get(i).getPyjhmc().equals(edu107.getPyjhmc())){
				relationNameHave= true;
				break;
			}
			
			if (!currentAllRelation.get(i).getEdu107_ID().equals(edu107.getEdu107_ID())&&
					currentAllRelation.get(i).getPyccbm().equals(edu107.getPyccbm())
					&& currentAllRelation.get(i).getXbbm().equals(edu107.getXbbm())
					&& currentAllRelation.get(i).getNjbm().equals(edu107.getNjbm())
					&& currentAllRelation.get(i).getZybm().equals(edu107.getZybm())) {
				have = true;
				break;
			}
		}
		// 不存在则修改关系
		if (!have) {
			administrationPageService.updateRelation(edu107);
		}
		
		returnMap.put("have", have);
		returnMap.put("result", true);
		returnMap.put("relationNameHave", relationNameHave);
		return returnMap;
	}

	
	
	
	/**
	 * 删除层次关系
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeRelation")
	@ResponseBody
	public Object deleteRelation(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeRelation(deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}

	
	
	
	/**
	 * 搜索层次关系
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("seacchRelation")
	@ResponseBody
	public Object seacchRelation(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
		Edu107 edu107 = new Edu107();
		edu107.setPyccmc(jsonObject.getString("lvelName"));
		edu107.setXbmc(jsonObject.getString("deaparmentName"));
		edu107.setNjmc(jsonObject.getString("gradeName"));
		edu107.setZymc(jsonObject.getString("majorName"));
		edu107.setPyjhmc(jsonObject.getString("relationName"));
		List<Edu107> relationList = administrationPageService.seacchRelation(edu107);
		returnMap.put("relationList", relationList);
		returnMap.put("result", true);
		return returnMap;
	}

	
	
	
	/**
	 * 新增层次
	 * 
	 * @param newRelationInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addNewLevel")
	@ResponseBody
	public Object addNewLevel(@RequestParam("newLevelInfo") String newLevelInfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(newLevelInfo);
		Edu103 edu103 = (Edu103) JSONObject.toBean(jsonObject, Edu103.class);
		List<Edu103> currentAllLevel = administrationPageService.queryAllLevel();
		// 判断层次是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllLevel.size(); i++) {
				if(currentAllLevel.get(i).getPyccmc().equals(edu103.getPyccmc())){
					namehave=true;
					break;
				}
				if(currentAllLevel.get(i).getPyccbm().equals(edu103.getPyccbm())){
					codehave=true;
					break;
				}
		}
		
		if(!namehave&&!codehave){
			String yxbz = "1";
			edu103.setYxbz(yxbz);
			administrationPageService.addNewLevel(edu103);
			Long id = edu103.getEdu103_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}

	
	/**
	 * 修改层次
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("updateLvel")
	@ResponseBody
	public Object updateLevel(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu103 edu103 = (Edu103) JSONObject.toBean(jsonObject, Edu103.class);
		List<Edu103> currentAllLevel = administrationPageService.queryAllLevel();
		// 判断层次是否已存在
		boolean namehave = false;
		boolean codehave = false;
		
		
		for (int i = 0; i < currentAllLevel.size(); i++) {
			if(!currentAllLevel.get(i).getEdu103_ID().equals(edu103.getEdu103_ID())&&
					currentAllLevel.get(i).getPyccmc().equals(edu103.getPyccmc())
					){
				namehave=true;
				break;
			}
			
			if(!currentAllLevel.get(i).getEdu103_ID().equals(edu103.getEdu103_ID())&&
					currentAllLevel.get(i).getPyccbm().equals(edu103.getPyccbm())
					){
				codehave=true;
				break;
			}
			
		}
		// 不存在则修改关系
		if (!namehave&&!codehave) {
			administrationPageService.updateLevel(edu103);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 删除层次
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeLevel")
	@ResponseBody
	public Object deleteLevel(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeLevel(deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	

	/**
	 * 新增系部
	 * 
	 * @param newRelationInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addNewDeaparment")
	@ResponseBody
	public Object addNewDeaparment(@RequestParam("newDeaparment") String newDeaparment) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(newDeaparment);
		Edu104 edu104 = (Edu104) JSONObject.toBean(jsonObject, Edu104.class);
		List<Edu104> currentAllDeaparment = administrationPageService.queryAllDepartment();
		// 判断层次是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllDeaparment.size(); i++) {
				if(currentAllDeaparment.get(i).getXbmc().equals(edu104.getXbmc())){
					namehave=true;
					break;
				}
				if(currentAllDeaparment.get(i).getXbbm().equals(edu104.getXbbm())){
					codehave=true;
					break;
				}
		}
		
		if(!namehave&&!codehave){
			String yxbz = "1";
			edu104.setYxbz(yxbz);
			administrationPageService.addNewDeaparment(edu104);
			Long id = edu104.getEdu104_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 修改系部
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("updateDeaparment")
	@ResponseBody
	public Object updateDeaparment(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu104 edu104 = (Edu104) JSONObject.toBean(jsonObject, Edu104.class);
		List<Edu104> currentAllDeaparment = administrationPageService.queryAllDepartment();
		// 判断系部是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllDeaparment.size(); i++) {
			if(!currentAllDeaparment.get(i).getEdu104_ID().equals(edu104.getEdu104_ID())&&
					currentAllDeaparment.get(i).getXbmc().equals(edu104.getXbmc())
					){
				namehave=true;
				break;
			}
			
			if(!currentAllDeaparment.get(i).getEdu104_ID().equals(edu104.getEdu104_ID())&&
					currentAllDeaparment.get(i).getXbbm().equals(edu104.getXbbm())
					){
				codehave=true;
				break;
			}
			
		}
		// 不存在则修改关系
		if (!namehave&&!codehave) {
			administrationPageService.updateDeaparment(edu104);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 删除系部
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeDeaparment")
	@ResponseBody
	public Object deleteDeaparment(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeDeaparment(deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 新增年级
	 * 
	 * @param newRelationInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addNewGrade")
	@ResponseBody
	public Object addNewGrade(@RequestParam("newGrade") String newGrade) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(newGrade);
		Edu105 edu105 = (Edu105) JSONObject.toBean(jsonObject, Edu105.class);
		List<Edu105> currentAllGrade = administrationPageService.queryAllGrade();
		// 判断层次是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllGrade.size(); i++) {
				if(currentAllGrade.get(i).getNjmc().equals(edu105.getNjmc())){
					namehave=true;
					break;
				}
				if(currentAllGrade.get(i).getNjbm().equals(edu105.getNjbm())){
					codehave=true;
					break;
				}
		}
		
		if(!namehave&&!codehave){
			String yxbz = "1";
			edu105.setYxbz(yxbz);
			administrationPageService.addNewGrade(edu105);
			Long id = edu105.getEdu105_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 修改年级
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("updateGrade")
	@ResponseBody
	public Object updateGrade(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu105 edu105 = (Edu105) JSONObject.toBean(jsonObject, Edu105.class);
		List<Edu105> currentAllGrade = administrationPageService.queryAllGrade();
		// 判断系部是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllGrade.size(); i++) {
			if(!currentAllGrade.get(i).getEdu105_ID().equals(edu105.getEdu105_ID())&&
					currentAllGrade.get(i).getNjmc().equals(edu105.getNjmc())
					){
				namehave=true;
				break;
			}
			
			if(!currentAllGrade.get(i).getEdu105_ID().equals(edu105.getEdu105_ID())&&
					currentAllGrade.get(i).getNjbm().equals(edu105.getNjbm())
					){
				codehave=true;
				break;
			}
			
		}
		// 不存在则修改关系
		if (!namehave&&!codehave) {
			administrationPageService.updateGrade(edu105);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 删除年级
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeGrade")
	@ResponseBody
	public Object deleteGrade(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeGrade(deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 新增专业
	 * 
	 * @param newRelationInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addNewMajor")
	@ResponseBody
	public Object addNewMajor(@RequestParam("newMajor") String newMajor) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(newMajor);
		Edu106 edu106 = (Edu106) JSONObject.toBean(jsonObject, Edu106.class);
		List<Edu106> currentAllMajor = administrationPageService.queryAllMajor();
		// 判断层次是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllMajor.size(); i++) {
				if(currentAllMajor.get(i).getZymc().equals(edu106.getZymc())){
					namehave=true;
					break;
				}
				if(currentAllMajor.get(i).getZybm().equals(edu106.getZybm())){
					codehave=true;
					break;
				}
		}
		
		if(!namehave&&!codehave){
			String yxbz = "1";
			edu106.setYxbz(yxbz);
			administrationPageService.addNewMajor(edu106);
			Long id = edu106.getEdu106_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	
	/**
	 * 修改专业
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("updateMajor")
	@ResponseBody
	public Object updateMajor(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu106 edu106 = (Edu106) JSONObject.toBean(jsonObject, Edu106.class);
		List<Edu106> currentAllMajor = administrationPageService.queryAllMajor();
		// 判断系部是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllMajor.size(); i++) {
			if(!currentAllMajor.get(i).getEdu106_ID().equals(edu106.getEdu106_ID())&&
					currentAllMajor.get(i).getZymc().equals(edu106.getZymc())
					){
				namehave=true;
				break;
			}
			
			if(!currentAllMajor.get(i).getEdu106_ID().equals(edu106.getEdu106_ID())&&
					currentAllMajor.get(i).getZybm().equals(edu106.getZybm())
					){
				codehave=true;
				break;
			}
			
		}
		// 不存在则修改关系
		if (!namehave&&!codehave) {
			administrationPageService.updateMajor(edu106);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	

	/**
	 * 删除专业
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeMajor")
	@ResponseBody
	public Object deleteMajor(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeMajor(deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	
	
	/**
	 * 获得所有层次
	 */
	@RequestMapping("/queryAllLevel")
	@ResponseBody
	public Object queryAllLevel() {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("allLevel", administrationPageService.queryAllLevel());
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	
	/**
	 * 获得某层次下的系部
	 */
	@RequestMapping("/levelMatchDepartment")
	@ResponseBody
	public Object levelMatchDepartment(@RequestParam String leveCode) {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("department", administrationPageService.levelMatchDepartment(leveCode));
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 获得某系部下的年级
	 */
	@RequestMapping("/departmentMatchGrade")
	@ResponseBody
	public Object departmentMatchGrade(@RequestParam String departmentCode) {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("grade", administrationPageService.departmentMatchGrade(departmentCode));
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 获得某年级下的专业
	 */
	@RequestMapping("/gradeMatchMajor")
	@ResponseBody
	public Object gradeMatchMajor(@RequestParam String gradeCode) {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("major", administrationPageService.gradeMatchMajor(gradeCode));
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 添加专业课程是查询(通过审核)课程
	 */
	@RequestMapping("/queryAllPassCrouse")
	@ResponseBody
	public Object queryCrouseBelongToCultureplan() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu200> allCrouse = administrationPageService.queryAllPassCrouse();
		returnMap.put("allCrouse", allCrouse);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 查询培养计划下的专业课程
	 */
	@RequestMapping("/queryCulturePlanCouses")
	@ResponseBody
	public Object queryCulturePlanCouses(@RequestParam("culturePlanInfo") String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
		List<Edu108> couserInfo = administrationPageService.queryCulturePlanCouses(edu107ID);
		returnMap.put("couserInfo", couserInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	

	
	/**
	 * 培养计划新增专业课程
	 */
	@RequestMapping("/culturePlanAddCrouse")
	@ResponseBody
	public Object culturePlanAddCrouse(@RequestParam("culturePlanInfo") String culturePlanInfo,@RequestParam("crouseInfo") String crouseInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject crouse = JSONObject.fromObject(crouseInfo);
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		Edu108 edu108 = (Edu108) JSONObject.toBean(crouse, Edu108.class);
		
		//通过 层次 系部 年级 专业定位培养计划 
		//获得培养计划ID
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
		String configTheCulturePlan="F";//初始化的是否生成开课计划
		String xbspTxt="noStatus";//初始化的系部审批
		edu108.setEdu107_ID(edu107ID);
		edu108.setSfsckkjh(configTheCulturePlan);
		edu108.setXbsp(xbspTxt);
	    administrationPageService.culturePlanAddCrouse(edu108);
		Long id = edu108.getEdu108_ID();
		
		returnMap.put("crouseID", id);
		returnMap.put("culturePlanID", edu107ID);
		returnMap.put("configTheCulturePlan", configTheCulturePlan);
		returnMap.put("departmentApproval", xbspTxt);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 *  修改培养计划下的专业课程
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("modifyCultureCrose")
	@ResponseBody
	public Object modifyCultureCrose(@RequestParam("culturePlanInfo") String culturePlanInfo,@RequestParam("modifyInfo") String modifyInfo) {
		Map<String, Object> returnMap = new HashMap();
		//根据层次等信息查出培养计划id
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
		//查询培养计划下的所有专业课程
		List<Edu108> currentAllCultureCrose = administrationPageService.queryCulturePlanCouses(edu107ID);
		
		//将修改信息转化为108实体
		JSONObject newCrouseInfo = JSONObject.fromObject(modifyInfo);
		Edu108 edu108 = (Edu108) JSONObject.toBean(newCrouseInfo, Edu108.class);
		
		// 判断课程信息是否冲突
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllCultureCrose.size(); i++) {
			if(!currentAllCultureCrose.get(i).getEdu108_ID().equals(edu108.getEdu108_ID())&&
					currentAllCultureCrose.get(i).getKcmc().equals(edu108.getKcmc())
					){
				namehave=true;
				break;
			}
			
			if(!currentAllCultureCrose.get(i).getEdu108_ID().equals(edu108.getEdu108_ID())&&
					currentAllCultureCrose.get(i).getKcdm().equals(edu108.getKcdm())
					){
				codehave=true;
				break;
			}
			
		}
		// 不存在则修改关系
		if (!namehave&&!codehave) {
			administrationPageService.updateCultureCrouse(edu108);
			administrationPageService.chengeCulturePlanCrouseStatus(edu108.getEdu108_ID().toString(),"noStatus");
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 删除培养计划下的专业课程
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeCultureCrose")
	@ResponseBody
	public Object deleteCultureCrose(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeCultureCrose(deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 培养计划添加专业课程检索
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("addCrouseSeacch")
	@ResponseBody
	public Object addCrouseSeacch(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		//根据层次等信息查出培养计划id
		String levelCode=searchObject.getString("level");
		String departmentCode=searchObject.getString("department");
		String gradeCode=searchObject.getString("grade");
		String majorCode=searchObject.getString("major");
		long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
		//填充搜索对象
		Edu108 edu108 = new Edu108();
		edu108.setEdu107_ID(edu107ID);
		edu108.setKcdm(searchObject.getString("coursesCode"));
		edu108.setKcmc(searchObject.getString("coursesName"));
		edu108.setBzzymc(searchObject.getString("majorWorkSign"));
		List<Edu108> crouseInfo = administrationPageService.addCrouseSeacch(edu108);
		returnMap.put("crouseInfo", crouseInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	
	/**
	 * 搜索培养计划下的专业课程
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("culturePlanSeacchCrouse")
	@ResponseBody
	public Object culturePlanSeacchCrouse(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		//根据层次等信息查出培养计划id
		String levelCode=searchObject.getString("level");
		String departmentCode=searchObject.getString("department");
		String gradeCode=searchObject.getString("grade");
		String majorCode=searchObject.getString("major");
		long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
		//填充搜索对象
		Edu108 edu108 = new Edu108();
		edu108.setEdu107_ID(edu107ID);
		edu108.setKcxzCode(searchObject.getString("coursesNature"));
		edu108.setKcmc(searchObject.getString("coursesName"));
		edu108.setKsfsCode(searchObject.getString("testWay"));
		edu108.setXbsp(searchObject.getString("suditStatus"));
		List<Edu108> crouseInfo = administrationPageService.culturePlanSeacchCrouse(edu108);
		returnMap.put("crouseInfo", crouseInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 培养计划审核
	 * 
	 * @param modifyInfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("chengeCulturePlanCrouseStatus")
	@ResponseBody
	public Object chengeCulturePlanCrouseStatus(@RequestParam String modifyInfo) {
		// 获得更改的课程
		JSONObject modifyObject = JSONObject.fromObject(modifyInfo);
		JSONArray classArray = modifyObject.getJSONArray("choosedCrouses");
		int changeType=modifyObject.getInt("changeType");
		// 获得更改的状态
        String status;
        if(changeType==1){
        	status="pass";
        }else if(changeType==2){
        	status="nopass";
        }else{
        	status="noStatus";
        }
        
		for (int i = 0; i < classArray.size(); i++) {
			administrationPageService.chengeCulturePlanCrouseStatus(classArray.get(i).toString(),status);
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		returnMap.put("status", status);
		return returnMap;
	}

	
	/**
	 * 培养计划审核 -改变培养计划反馈意见
	 * 
	 * @param modifyInfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("chengeCulturePlanCrouseFeedBack")
	@ResponseBody
	public Object chengeCulturePlanCrouseFeedBack(@RequestParam String id,@RequestParam String feedBack) {
		// 获得更改的状态
		administrationPageService.chengeCulturePlanCrouseFeedBack(id,feedBack);
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 新增行政班
	 * 
	 * @param newRelationInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addAdministrationClass")
	@ResponseBody
	public Object addAdministrationClass(@RequestParam("addInfo") String addInfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 
		JSONObject jsonObject = JSONObject.fromObject(addInfo);
		Edu300 edu300 = (Edu300) JSONObject.toBean(jsonObject, Edu300.class);
		List<Edu300> currentAllAdministrationClasses = administrationPageService.queryAllAdministrationClasses();
		
		// 判断层次是否已存在
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllAdministrationClasses.size(); i++) {
				if(currentAllAdministrationClasses.get(i).getXzbmc().equals(edu300.getXzbmc())){
					namehave=true;
					break;
				}
				if(currentAllAdministrationClasses.get(i).getXzbbm()!=null&&currentAllAdministrationClasses.get(i).getXzbbm().equals(edu300.getXzbbm())){
					codehave=true;
					break;
				}
		}
		
		if(!namehave&&!codehave){
			String yxbz = "1";  //有效标志
			String configTheCulturePlan="F";//初始化的是否生成开课计划
			edu300.setYxbz(yxbz);
			edu300.setSfsckkjh(configTheCulturePlan);
			administrationPageService.addAdministrationClass(edu300);
			Long id = edu300.getEdu300_ID();
			returnMap.put("yxbz", yxbz);
			returnMap.put("id", id);
			returnMap.put("sfsckkjh", configTheCulturePlan);
		}
		
		returnMap.put("namehave", namehave);
		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 *  修改行政班
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
//	@RequestMapping("modifyAdministrationClass")
//	@ResponseBody
//	public Object modifyAdministrationClass(@RequestParam("culturePlanInfo") String culturePlanInfo,@RequestParam("modifyInfo") String modifyInfo) {
//		Map<String, Object> returnMap = new HashMap();
//		//根据层次等信息查出培养计划id
//		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
//		String levelCode=culturePlan.getString("level");
//		String departmentCode=culturePlan.getString("department");
//		String gradeCode=culturePlan.getString("grade");
//		String majorCode=culturePlan.getString("major");
//		List<Edu300> currentAllAdministrationClasses = administrationPageService.queryAllAdministrationClasses();
//		
//		//将修改信息转化为108实体
//		JSONObject newCrouseInfo = JSONObject.fromObject(modifyInfo);
//		Edu300 edu300 = (Edu300) JSONObject.toBean(newCrouseInfo, Edu300.class);
//		
//		// 判断是否冲突
//		boolean namehave = false;
//		boolean codehave = false;
//		for (int i = 0; i < currentAllAdministrationClasses.size(); i++) {
//			if(!currentAllAdministrationClasses.get(i).getEdu300_ID().equals(edu300.getEdu300_ID())&&
//					currentAllAdministrationClasses.get(i).getXzbmc().equals(edu300.getXzbmc())
//					){
//				namehave=true;
//				break;
//			}
//			
//			if(!currentAllAdministrationClasses.get(i).getEdu300_ID().equals(edu300.getEdu300_ID())&&
//					currentAllAdministrationClasses.get(i).getXzbbm().equals(edu300.getXzbbm())
//					){
//				codehave=true;
//				break;
//			}
//			
//		}
//		// 不存在则修改
//		if (!namehave&&!codehave) {
//			administrationPageService.updateAdministrationClass(edu300);
//			administrationPageService.updateStudentAdministrationInfo(administrationPageService.queryAllStudent(),edu300);
//		}
//		
//		returnMap.put("namehave", namehave);
//		returnMap.put("codehave", codehave);
//		returnMap.put("result", true);
//		return returnMap;
//	}
	
	
	
	
	/**
	 * 查询培养计划下的行政班
	 */
	@RequestMapping("/queryCulturePlanAdministrationClasses")
	@ResponseBody
	public Object queryCulturePlanAdministrationClasses(@RequestParam("culturePlanInfo") String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		
		List<Edu300> currentAllAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode,gradeCode,majorCode);
		returnMap.put("classesInfo", currentAllAdministrationClasses);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	
	/**
	 * 删除培养计划下的行政班
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeAdministrationClass")
	@ResponseBody
	public Object deleteAdministrationClass(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		List<Edu001> allStudent=administrationPageService.queryAllStudent();
		
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeAdministrationClass(deleteArray.get(i).toString());
			administrationPageService.removeXZBAndUpdateStudentCorrelationInfo(allStudent,deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 搜索行政班
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("searchAdministrationClass")
	@ResponseBody
	public Object searchAdministrationClass(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		//根据层次等信息查出培养计划id
		String levelCode=searchObject.getString("level");
		String departmentCode=searchObject.getString("department");
		String gradeCode=searchObject.getString("grade");
		String majorCode=searchObject.getString("major");
		String className=searchObject.getString("className");
		
		//填充搜索对象
		Edu300 edu300 = new Edu300();
		edu300.setPyccbm(levelCode);
		edu300.setXbbm(departmentCode);
		edu300.setNjbm(gradeCode);
		edu300.setZybm(majorCode);
		edu300.setXzbmc(className);
		List<Edu300> calssInfo = administrationPageService.searchAdministrationClass(edu300);
		returnMap.put("calssInfo", calssInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 生成开课计划查询课程库和班级信息
	 */
	@RequestMapping("/getGeneratCoursePalnInfo")
	@ResponseBody
	public Object getGeneratCoursePalnInfo(@RequestParam("culturePlanInfo") String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
        long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
        //培养计划下的课程
		List<Edu108> couserInfo = administrationPageService.queryCulturePlanCouses(edu107ID);
		//培养计划下的行政班
		List<Edu300> currentAllAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode,gradeCode,majorCode);
		returnMap.put("tableInfo", couserInfo);
		returnMap.put("classInfo", currentAllAdministrationClasses);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 确认生成开课计划
	 */
	@RequestMapping("/generatCoursePlan")
	@ResponseBody
	public Object generatCoursePlan(@RequestParam("generatInfo") String generatInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(generatInfo);
		JSONArray classArray = culturePlan.getJSONArray("classIds");
		JSONArray classNames = culturePlan.getJSONArray("classNames");
		JSONArray edu108Ids = culturePlan.getJSONArray("crouses");
		
		String isGeneratCoursePlan="T";
		//eud300  行政班更改开课计划属性
		for (int i = 0; i < classArray.size(); i++) {
			administrationPageService.generatAdministrationCoursePlan(classArray.get(i).toString(),isGeneratCoursePlan);
		}
		
		//eud180 课程更改开课计划属性
		for (int i = 0; i < edu108Ids.size(); i++) {
			administrationPageService.generatCoursePlan(edu108Ids.get(i).toString(),classNames.toString(),classArray.toString(),isGeneratCoursePlan);
		}
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 生成专业下所有课程开课计划
	 */
	@RequestMapping("/generatAllClassAllCourse")
	@ResponseBody
	public Object generatAllClassAllCourse(@RequestParam("generatInfo") String generatInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(generatInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		long edu107ID=administrationPageService.queryEdu107ID(levelCode,departmentCode,gradeCode,majorCode);
		
		//查询培养计划下的行政班
		List<Edu300> administrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode,gradeCode,majorCode);
		List<String> classNames =new ArrayList();
		List<String> classIds =new ArrayList();
		for (int i = 0; i < administrationClasses.size(); i++) {
			classNames.add(administrationClasses.get(i).getXzbmc());
			classIds.add(administrationClasses.get(i).getEdu300_ID().toString());
		}
		
		
		//查询培养计划下所有课程
		List<Edu108> allCrouse = administrationPageService.queryCulturePlanCouses(edu107ID);
		String isGeneratCoursePlan="T";
		List<Edu108> crouseInfo =new ArrayList();
		for (int i = 0; i < allCrouse.size(); i++) {
			//课程通过审核则生成开课计划
			if(allCrouse.get(i).getXbsp().equals("pass")){
				for (int g = 0; g < administrationClasses.size(); g++) {
					for (int c = 0; c < classIds.size(); c++) {
						//eud300  行政班更改开课计划属性
						administrationPageService.generatAdministrationCoursePlan(classIds.get(i),isGeneratCoursePlan);
					}
				
					
					//eud180 课程更改开课计划属性
					administrationPageService.generatCoursePlan(allCrouse.get(i).getEdu108_ID().toString(),JSONArray.fromObject(classNames).toString(),JSONArray.fromObject(classIds).toString(),isGeneratCoursePlan);
					Edu108 edu108=allCrouse.get(i);
					edu108.setSfsckkjh(isGeneratCoursePlan);
					edu108.setEdu300_ID(JSONArray.fromObject(classIds).toString());
					edu108.setXzbmc(JSONArray.fromObject(classNames).toString());
					crouseInfo.add(edu108);
				}
			}
		}
		
		returnMap.put("crouseInfo", crouseInfo);
		returnMap.put("result", true);
		return returnMap;
	}

	
	
	/**
	 * 教学班管理 - 查询已生成开课计划的行政班班级库
	 */
	@RequestMapping("/teachingClassQueryAdministrationClassesLibrary")
	@ResponseBody
	public Object teachingClassQueryAdministrationClassesLibrary(@RequestParam("culturePlanInfo") String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		List<Map> classesInfo=new ArrayList(); //组装返回信息
		/*
		 * 1.查询所有行政班  List<Edu300>
		 * 
		 * 2.查询培养计划 List<Edu108>
		 * 
		 * 3.行政班信息+课程信息 组装返回信息
		 * 
		 * */
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		List<Edu300> allAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode,gradeCode,majorCode);
		
		
		//组装行政班的培养计划信息
		for (int i = 0; i < allAdministrationClasses.size(); i++) {
			List<Edu108> palnInfos = administrationPageService.queryAdministrationClassesCrouse(allAdministrationClasses.get(i).getEdu300_ID().toString());
			for (int p = 0; p < palnInfos.size(); p++) {
				Map<String, Object> administrationClassesWithcrouseInfo = new HashMap();
				administrationClassesWithcrouseInfo.put("edu108_ID", palnInfos.get(p).getEdu108_ID());
				administrationClassesWithcrouseInfo.put("edu300_ID", allAdministrationClasses.get(i).getEdu300_ID());
				administrationClassesWithcrouseInfo.put("xqmc", allAdministrationClasses.get(i).getXqmc());
				administrationClassesWithcrouseInfo.put("xqbm", allAdministrationClasses.get(i).getXqbm());
				administrationClassesWithcrouseInfo.put("zymc", allAdministrationClasses.get(i).getZymc());
				administrationClassesWithcrouseInfo.put("zybm", allAdministrationClasses.get(i).getZybm());
				administrationClassesWithcrouseInfo.put("xzbmc", allAdministrationClasses.get(i).getXzbmc());
				administrationClassesWithcrouseInfo.put("xzbbm", allAdministrationClasses.get(i).getXzbbm());
				administrationClassesWithcrouseInfo.put("kcmc", palnInfos.get(p).getKcmc());
				administrationClassesWithcrouseInfo.put("ksdm", palnInfos.get(p).getKcdm());
				administrationClassesWithcrouseInfo.put("kcxz", palnInfos.get(p).getKcxz());
				administrationClassesWithcrouseInfo.put("kcxzCode", palnInfos.get(p).getKcxzCode());
				administrationClassesWithcrouseInfo.put("xf", palnInfos.get(p).getXf());
				administrationClassesWithcrouseInfo.put("skxq", palnInfos.get(p).getSkxq());
				administrationClassesWithcrouseInfo.put("zdrs", allAdministrationClasses.get(i).getZxrs());
				administrationClassesWithcrouseInfo.put("rnrs", allAdministrationClasses.get(i).getRnrs());
				administrationClassesWithcrouseInfo.put("jxbrs",0);
				administrationClassesWithcrouseInfo.put("jxbmc", "");
				classesInfo.add(administrationClassesWithcrouseInfo);
			}
		}
		
		returnMap.put("classesInfo", classesInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 教学班管理 -验证行政班信息
	 * 
	 * @param combinedInfo合班信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("verifyClassInfo")
	@ResponseBody
	public Object verifyClassInfo(@RequestParam("verifyInfo") String verifyInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONArray array = JSONArray.fromObject(verifyInfo); //解析json字符
		List<Edu301> allTeachingClasses = administrationPageService.queryAllTeachingClass();
		List<Edu301> verifyList = new ArrayList<Edu301>();
		boolean willDropFirsthand=false;   //是否提示用户将删除原始教学班
		 
		for (int i = 0; i < array.size(); i++) {
			JSONObject jsonObject = JSONObject.fromObject(array.getJSONObject(i));
			Edu301 verifyEdu301=new Edu301();
			verifyEdu301.setEdu108_ID(jsonObject.getLong("edu108_ID"));
			verifyEdu301.setJxbmc(jsonObject.getString("jxbmc"));
			verifyEdu301.setPyccmc(jsonObject.getString("pyccmc"));
			verifyEdu301.setPyccbm(jsonObject.getString("pyccbm"));
			verifyEdu301.setXbmc(jsonObject.getString("xbmc"));
			verifyEdu301.setXbbm(jsonObject.getString("xbbm"));
			verifyEdu301.setNjmc(jsonObject.getString("njmc"));
			verifyEdu301.setNjbm(jsonObject.getString("njbm"));
			verifyEdu301.setZymc(jsonObject.getString("zymc"));
			verifyEdu301.setZybm(jsonObject.getString("zybm"));
			verifyEdu301.setBhzyCode(jsonObject.getString("bhzyCode"));
			verifyEdu301.setBhzymc(jsonObject.getString("bhzymc"));
			verifyEdu301.setBhxzbid(jsonObject.getString("bhxzbCode"));
			verifyEdu301.setBhxzbmc(jsonObject.getString("bhxzbmc"));
			verifyEdu301.setBhxsCode(jsonObject.getString("bhxsCode"));
			verifyEdu301.setSffbjxrws(jsonObject.getString("sffbjxrws"));
			verifyEdu301.setJxbrs(jsonObject.getInt("jxbrs"));
			verifyEdu301.setYxbz(jsonObject.getString("yxbz"));
			verifyList.add(verifyEdu301);
		}
		
		
		allforOver:
		 for (int i = 0; i < verifyList.size(); i++) {
			 Edu301 thisClassInfo=verifyList.get(i);
			 
			 if(thisClassInfo.getBhxsCode()!=null&&!thisClassInfo.getBhxsCode().equals("")){
				 //按学生拆班的情况
				 for (int a = 0; a < allTeachingClasses.size(); a++) {
					 if(thisClassInfo.getEdu108_ID().equals(allTeachingClasses.get(a).getEdu108_ID())){
						   //查询学生所在行政班
						   String[] students=thisClassInfo.getBhxsCode().split(",");
						   String currentTeachingClassesBhxzbCode=allTeachingClasses.get(a).getBhxzbid();
						   for (int s = 0; s < students.length; s++) {
							String xzbCode=administrationPageService.queryStudentXzbCode(students[s]);
							 //如果学生所在行政班有教学班则提示用户将删除原始教学班
							if(xzbCode!=null){
								if(currentTeachingClassesBhxzbCode!=null&&currentTeachingClassesBhxzbCode.indexOf(xzbCode)!=-1){
									willDropFirsthand=true;
									break allforOver;
								}
							}
						   }
					}
				 }
			 }else{
				 for (int a = 0; a < allTeachingClasses.size(); a++) {
						if(thisClassInfo.getEdu108_ID().equals(allTeachingClasses.get(a).getEdu108_ID())){
						String currentTeachingClassesBhxzbCode=allTeachingClasses.get(a).getBhxzbid();
						String[] edu301BhxzbCode=thisClassInfo.getBhxzbid().split(",");
						for (int e = 0; e < edu301BhxzbCode.length; e++) {
							if(currentTeachingClassesBhxzbCode!=null&&currentTeachingClassesBhxzbCode.indexOf(edu301BhxzbCode[e])!=-1){
								willDropFirsthand=true;
								break allforOver;
							}
						}
					}
				 }
			 }
		 }

		returnMap.put("willDropFirsthand", willDropFirsthand);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 教学班管理 -确认班级操作
	 * 
	 * @param combinedInfo合班信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("confirmClassAction")
	@ResponseBody
	public Object confirmClassAction(@RequestParam("classInfo") String classInfo) {
		Map<String, Object> returnMap = new HashMap();
		List<Edu301> allTeachingClasses = administrationPageService.queryAllTeachingClass();
		List<Edu001> allStudent = administrationPageService.queryAllStudent();	
		JSONArray array = JSONArray.fromObject(classInfo); //解析json字符
		List<Edu301> verifyList = new ArrayList<Edu301>();
		for (int i = 0; i < array.size(); i++) {
			JSONObject jsonObject = JSONObject.fromObject(array.getJSONObject(i));
			Edu301 verifyEdu301=new Edu301();
			verifyEdu301.setEdu108_ID(jsonObject.getLong("edu108_ID"));
			verifyEdu301.setKcmc(jsonObject.getString("kcmc"));
			verifyEdu301.setJxbmc(jsonObject.getString("jxbmc"));
			verifyEdu301.setPyccmc(jsonObject.getString("pyccmc"));
			verifyEdu301.setPyccbm(jsonObject.getString("pyccbm"));
			verifyEdu301.setXbmc(jsonObject.getString("xbmc"));
			verifyEdu301.setXbbm(jsonObject.getString("xbbm"));
			verifyEdu301.setNjmc(jsonObject.getString("njmc"));
			verifyEdu301.setNjbm(jsonObject.getString("njbm"));
			verifyEdu301.setZymc(jsonObject.getString("zymc"));
			verifyEdu301.setZybm(jsonObject.getString("zybm"));
			verifyEdu301.setBhzyCode(jsonObject.getString("bhzyCode"));
			verifyEdu301.setBhzymc(jsonObject.getString("bhzymc"));
			verifyEdu301.setBhxzbid(jsonObject.getString("bhxzbCode"));
			verifyEdu301.setBhxzbmc(jsonObject.getString("bhxzbmc"));
			verifyEdu301.setBhxsCode(jsonObject.getString("bhxsCode"));
			verifyEdu301.setSffbjxrws(jsonObject.getString("sffbjxrws"));
			verifyEdu301.setJxbrs(jsonObject.getInt("jxbrs"));
			verifyEdu301.setYxbz(jsonObject.getString("yxbz"));
			verifyList.add(verifyEdu301);
		}
		administrationPageService.classAction(verifyList);	
		returnMap.put("result", true);
		return returnMap;
	}


	
	
	/**
	 * 根据行政班查询学生信息
	 */
	@RequestMapping("/queryStudentInfoByAdministrationClass")
	@ResponseBody
	public Object queryStudentInfoByAdministrationClass(@RequestParam("xzbCodeObject") String xzbCodeObject) {
		Map<String, Object> returnMap = new HashMap();
		List<Edu001> studentInfos = new ArrayList<Edu001>();
		JSONObject xzbCodeJson = JSONObject.fromObject(xzbCodeObject);
		String xzbcode=xzbCodeJson.getString("edu300_ID");
		if(xzbcode.equals("")){
			studentInfos = administrationPageService.queryAllStudent();
		}else{
			if(xzbcode.indexOf(",")==-1){
				List<Edu001> administrationClassStudents = administrationPageService.queryStudentInfoByAdministrationClass(xzbcode);
				for (int a = 0; a < administrationClassStudents.size(); a++) {
					Edu001 edu001=administrationClassStudents.get(a);
					studentInfos.add(edu001);
				}
			}else{
				com.alibaba.fastjson.JSONArray xzbcodeArray = JSON.parseArray(xzbcode);
				for (int x = 0; x < xzbcodeArray.size(); x++) {
					List<Edu001> administrationClassStudents = administrationPageService.queryStudentInfoByAdministrationClass(xzbcodeArray.get(x).toString());
					for (int a = 0; a < administrationClassStudents.size(); a++) {
						Edu001 edu001=administrationClassStudents.get(a);
						studentInfos.add(edu001);
					}
				}
			}
		}
		
		returnMap.put("studentInfo", studentInfos);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 拆班搜索学生
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("breakClassSearchStudent")
	@ResponseBody
	public Object breakClassSearchStudent(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		//根据层次等信息查出培养计划id
		String xzbcode=searchObject.getString("xzbcode");
		String xb=searchObject.getString("xb");
		String ztCode=searchObject.getString("zt");
		String xm=searchObject.getString("xm");
		
		//填充搜索对象
		Edu001 edu001 = new Edu001();
		edu001.setEdu300_ID(xzbcode);
		edu001.setXb(xb);
		edu001.setZtCode(ztCode);
		edu001.setXm(xm);
		List<Edu001> calssInfo = administrationPageService.breakClassSearchStudent(edu001);
		returnMap.put("calssInfo", calssInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 查询所有教学班
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("getAllTeachingClasses")
	@ResponseBody
	public Object getAllTeachingClasses(@RequestParam String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		
		List<Edu301> calssInfo = administrationPageService.getCulturePlanAllTeachingClasses(levelCode,departmentCode,gradeCode,majorCode);
		returnMap.put("calssInfo", calssInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 修改教学班名称
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("modifyTeachingClassName")
	@ResponseBody
	public Object modifyTeachingClassName(@RequestParam String modifyObject) {
		Map<String, Object> returnMap = new HashMap();
		boolean namehave = false;
		JSONObject modifyInfo = JSONObject.fromObject(modifyObject);
		String teachingClassID=modifyInfo.getString("teachingClassID");
		String newName=modifyInfo.getString("newName");
		
		List<Edu301> calssInfo = administrationPageService.getAllTeachingClasses();
		for (int a = 0; a < calssInfo.size(); a++) {
			if(newName.equals(calssInfo.get(a).getJxbmc())){
				namehave = true;
				break;
			}
		}
		
		if(!namehave){
			administrationPageService.modifyTeachingClassName(teachingClassID,newName);
		}
		
		returnMap.put("result", true);
		returnMap.put("namehave", namehave);
		return returnMap;
	}
	
	

	/**
	 * 删除教学班
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeTeachingClass")
	@ResponseBody
	public Object removeTeachingClass(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		List<Edu001> allStudent=administrationPageService.queryAllStudent();
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeTeachingClassByID(deleteArray.get(i).toString());
			administrationPageService.updateStudentTeachingClassInfo(allStudent,deleteArray.get(i).toString());
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 搜索教学班
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("searchTeachingClass")
	@ResponseBody
	public Object searchTeachingClass(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		//根据层次等信息查出培养计划id
		String className=searchObject.getString("className");
		String coursesName=searchObject.getString("coursesName");
		
		//填充搜索对象
		Edu301 edu301 = new Edu301();
		edu301.setJxbmc(className);
		edu301.setKcmc(coursesName);
		List<Edu301> tableInfo = administrationPageService.searchTeachingClass(edu301);
		returnMap.put("tableInfo", tableInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 教学班班管理检索
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("searchTeachingClassQueryAdministrationClassesLibrary")
	@ResponseBody
	public Object searchTeachingClassQueryAdministrationClassesLibrary(@RequestParam String SearchCriteria,@RequestParam String culturePlanInfo) {
		
		Map<String, Object> returnMap = new HashMap();
		List<Map> classesInfo=new ArrayList(); //组装返回信息
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		String xzbmc=searchObject.getString("xzbmc");
		String kcmc=searchObject.getString("kcmc");
		
		List<Edu300> allAdministrationClasses=new ArrayList<Edu300>();
		if(!xzbmc.equals("")){
			Edu300 edu300=new Edu300();
			edu300.setPyccbm(levelCode);
			edu300.setXbbm(departmentCode);
			edu300.setNjbm(gradeCode);
			edu300.setZybm(majorCode);
			edu300.setXzbmc(xzbmc);
		    allAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClassesWithXZBMC(edu300);
		}else{
		    allAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode,gradeCode,majorCode);
		}
		
		
		//组装行政班的培养计划信息
		for (int i = 0; i < allAdministrationClasses.size(); i++) {
			List<Edu108> palnInfos=new ArrayList<Edu108>();
			if(!kcmc.equals("")){
				Edu108 edu108=new Edu108();
				edu108.setEdu300_ID(allAdministrationClasses.get(i).getEdu300_ID().toString());
				edu108.setKcmc(kcmc);
				palnInfos = administrationPageService.queryAdministrationClassesCrouseWithKCMC(edu108);
			}else{
				palnInfos = administrationPageService.queryAdministrationClassesCrouse(allAdministrationClasses.get(i).getEdu300_ID().toString());
			}
			
			for (int p = 0; p < palnInfos.size(); p++) {
				Map<String, Object> administrationClassesWithcrouseInfo = new HashMap();
				administrationClassesWithcrouseInfo.put("edu108_ID", palnInfos.get(p).getEdu108_ID());
				administrationClassesWithcrouseInfo.put("edu300_ID", allAdministrationClasses.get(i).getEdu300_ID());
				administrationClassesWithcrouseInfo.put("xqmc", allAdministrationClasses.get(i).getXqmc());
				administrationClassesWithcrouseInfo.put("xqbm", allAdministrationClasses.get(i).getXqbm());
				administrationClassesWithcrouseInfo.put("zymc", allAdministrationClasses.get(i).getZymc());
				administrationClassesWithcrouseInfo.put("zybm", allAdministrationClasses.get(i).getZybm());
				administrationClassesWithcrouseInfo.put("xzbmc", allAdministrationClasses.get(i).getXzbmc());
				administrationClassesWithcrouseInfo.put("xzbbm", allAdministrationClasses.get(i).getXzbbm());
				administrationClassesWithcrouseInfo.put("kcmc", palnInfos.get(p).getKcmc());
				administrationClassesWithcrouseInfo.put("ksdm", palnInfos.get(p).getKcdm());
				administrationClassesWithcrouseInfo.put("kcxz", palnInfos.get(p).getKcxz());
				administrationClassesWithcrouseInfo.put("kcxzCode", palnInfos.get(p).getKcxzCode());
				administrationClassesWithcrouseInfo.put("xf", palnInfos.get(p).getXf());
				administrationClassesWithcrouseInfo.put("skxq", palnInfos.get(p).getSkxq());
				administrationClassesWithcrouseInfo.put("zdrs", allAdministrationClasses.get(i).getZxrs());
				administrationClassesWithcrouseInfo.put("rnrs", allAdministrationClasses.get(i).getRnrs());
				administrationClassesWithcrouseInfo.put("jxbrs",0);
				administrationClassesWithcrouseInfo.put("jxbmc", "");
				classesInfo.add(administrationClassesWithcrouseInfo);
			}
		}
		
		returnMap.put("classesInfo", classesInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	

	
	
	/**
	 * 查询培养计划下所有学生
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("queryCulturePlanStudent")
	@ResponseBody
	public Object queryCulturePlanStudent(@RequestParam String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode=culturePlan.getString("level");
		String departmentCode=culturePlan.getString("department");
		String gradeCode=culturePlan.getString("grade");
		String majorCode=culturePlan.getString("major");
		
		List<Edu001> studentInfo = administrationPageService.queryCulturePlanStudent(levelCode,departmentCode,gradeCode,majorCode);
		List<Edu300> classInfo = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode,gradeCode,majorCode);
		returnMap.put("studentInfo", studentInfo);
		returnMap.put("classInfo", classInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 新增学生
	 * 
	 * @param addInfo新增信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("addStudent")
	@ResponseBody
	public Object addStudent(@RequestParam("addInfo") String addInfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(addInfo);
		Edu001 edu001 = (Edu001) JSONObject.toBean(jsonObject, Edu001.class);
		List<Edu001> currentAllStudent = administrationPageService.queryAllStudent();
		// 判断学号是否已存在
		boolean xhhave = false;
		//判断新增学生是否会超过行政班容纳人数
		boolean studentSpill = administrationPageService.administrationClassesIsSpill(edu001.getEdu300_ID());
		for (int i = 0; i < currentAllStudent.size(); i++) {
				if(currentAllStudent.get(i).getXh().equals(edu001.getXh())){
					xhhave=true;
					break;
				}
		}
		
		if(!xhhave&&!studentSpill){
			String yxbz = "1";
			edu001.setYxbz(yxbz);
			administrationPageService.addStudent(edu001); //新增学生
			Long newStudentid = edu001.getEdu001_ID();
			
			List<Edu301> teachingClassesBy300id=administrationPageService.queryTeachingClassByXzbCode(edu001.getEdu300_ID());
			String xzbid=edu001.getEdu300_ID();
			administrationPageService.addStudentUpdateCorrelationInfo(teachingClassesBy300id,xzbid); 
			
			returnMap.put("id", newStudentid);
			returnMap.put("yxbz", yxbz);
		}
		
		returnMap.put("xhhave", xhhave);
		returnMap.put("studentSpill", studentSpill);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 删除学生
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("removeStudents")
	@ResponseBody
	public Object removeStudents(@RequestParam String removeInfo) {
		JSONArray deleteArray = JSONArray.fromObject(removeInfo); //解析json字符
		for (int i = 0; i < deleteArray.size(); i++) {
		  JSONObject jsonObject = deleteArray.getJSONObject(i); 
		  String edu300_ID=jsonObject.getString("edu300_ID");
		  long  studentId=jsonObject.getLong("studentId");
		  
		  List<Edu301> teachingClassesBy300id=administrationPageService.queryTeachingClassByXzbCode(edu300_ID);
		  List<Edu301> teachingClassesBy001id=administrationPageService.queryTeachingClassByXSCode(String.valueOf(studentId));
		  administrationPageService.removeStudentUpdateCorrelationInfo(teachingClassesBy300id,teachingClassesBy001id,edu300_ID,studentId); 
		  administrationPageService.removeStudentByID(studentId);
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 修改学生
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	
	@RequestMapping("modifyStudent")
	@ResponseBody
	public Object modifyStudent(@RequestParam("updateinfo") String updateinfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateinfo);
		Edu001 edu001 = (Edu001) JSONObject.toBean(jsonObject, Edu001.class);
		List<Edu001> currentAllStudent = administrationPageService.queryAllStudent();
		
		
		// 判断学号是否已存在
		boolean xhhave = false;
		
		for (int i = 0; i < currentAllStudent.size(); i++) {
			if(!currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())&&
					currentAllStudent.get(i).getXh().equals(edu001.getXh())
					){
				xhhave=true;
				break;
			}
		}
		
		boolean isChangeXZB= false;
		for (int i = 0; i < currentAllStudent.size(); i++) {
			if(currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())){
				if(currentAllStudent.get(i).getEdu300_ID()==null||currentAllStudent.get(i).getEdu300_ID().equals("")){
					isChangeXZB=true;
					break;
				}else{
					if(!currentAllStudent.get(i).getEdu300_ID().equals(edu001.getEdu300_ID())){
						isChangeXZB=true;
						break;
					}
				}
			}
		}
		
		// 不存在则修改学生
		if (!xhhave) {
			if(!isChangeXZB){
				//没有修改行政班的情况
				administrationPageService.addStudent(edu001);
			}else{
				
				administrationPageService.updateStudent(edu001);
			}
		}
		
		returnMap.put("xhhave", xhhave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	
	

	/**
	 * 下载学生导入模板
	 * 
	 * @return returnMap
	 * @throws IOException 
	 */
	@RequestMapping("downloadStudentModal")
	@ResponseBody
	public void downloadStudentModal(HttpServletResponse response) throws IOException {
		Map<String, Object> returnMap = new HashMap();
		Map<String, List> othserInfo = new HashMap();
		// 获取项目根路径
		String rootPath = getClass().getResource("/").getFile().toString();
        //获取模板路径
		String filePath = rootPath + "static/modalFile/importStudent.xlsx";
		
		othserInfo.put("pcyy", administrationPageService.queryAllLevel());
		othserInfo.put("xb", administrationPageService.queryAllDepartment());
		othserInfo.put("nj", administrationPageService.queryAllGrade());
		othserInfo.put("zy", administrationPageService.queryAllMajor());
		othserInfo.put("xzb", administrationPageService.queryAllAdministrationClasses());
		othserInfo.put("xszt", administrationPageService.queryEjdm("xszt"));
		othserInfo.put("zzmm", administrationPageService.queryEjdm("zzmm"));
		othserInfo.put("whcd", administrationPageService.queryEjdm("whcd"));
		othserInfo.put("zsfs", administrationPageService.queryEjdm("zsfs"));
		//修改学生导入模板
		utils.modifyImportStudentModal(filePath,othserInfo);
        //下载模板
		utils.loadImportStudentModal(filePath,response);
	}
	
	
	/**
	 * 导入学生
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 * @throws IOException 
	 * @throws EncryptedDocumentException 
	 * @throws Exception 
	 * @throws InvalidFormatException 
	 * @throws ServletException 
	 */
	@RequestMapping("importStudent")
	@ResponseBody
	public Object importStudent(@RequestParam("file") MultipartFile file) throws IOException, EncryptedDocumentException, InvalidFormatException {
		Map<String, Object> returnMap = new HashMap();
//		boolean isExcel=true;
//		boolean haveSheet=true;
//		
//		//判断读取的文件是否为Excel文件
//		String fileName = file.getOriginalFilename();
//		String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
//		
//		
//		//文件格式不正确 返回
//		if(!utils.checkFile(suffix)){
//			returnMap.put("isExcel", false);
//			return returnMap;
//		}
//		
//		//文件格式正确解析Excel文件 获取新增学生实体 
//		List<Map<String,Object>> importStudents = utils.getImportStudent(file.getInputStream());
//		if(importStudents.size()==0){
//			returnMap.put("haveSheet", false);
//			return returnMap;
//		}
//		
//		
//		
//		//保存到数据库
//		//todo 
		
//		returnMap.put("importStudents", importStudents);
//		returnMap.put("isExcel", isExcel);
//		returnMap.put("haveSheet", haveSheet);
	    return returnMap;
    }
	
	
	
	/**
	 * 检验导入学生的文件
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 * @throws ParseException 
	 * @throws Exception 
	 * @throws ServletException 
	 */
	@RequestMapping("verifiyImportStudentFile")
	@ResponseBody
	public Object verifiyImportStudentFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		Map<String, List> checkNeedInfo = new HashMap();
		checkNeedInfo.put("pcyy", administrationPageService.queryAllLevel());
		
		Map<String, Object> checkRS= utils.checkFile(file,"edu001","学生信息",checkNeedInfo);
		checkRS.put("result", true);
	    return checkRS;
    }
	
	
	
	
	
	
	
	
	
//	private ArrayList<Object> getList(InputStream inputStream,String suffix) throws IOException {
//        ArrayList<Object> arrayList = new ArrayList<Object>();
//        // 具体执行导入，可以引入策略模式
//        // 解决excel2003和excel2007版本的问题
//        if ("xlsx".equals(suffix)) {
//            xlsxImp(inputStream, arrayList);
//        }
//        if ("xls".equals(suffix)) {
//            xlsImp(inputStream, arrayList);
//        }
//        // 万一新增一种新格式，对修改打开了，不符合oo编程规范
//        return arrayList;
//    }
//	
//	  private void xlsImp(InputStream inputStream, ArrayList<Object> arrayList) throws IOException {
//	        // 初始整个Excel
//	        HSSFWorkbook workbook = new HSSFWorkbook(inputStream);
//	        // 获取第一个sheet表
//	        HSSFSheet sheet = workbook.getSheetAt(0);
//	        for (int rowIndex = 2; rowIndex < sheet.getLastRowNum(); rowIndex++) {
//	            HashMap<String, Object> hashMap = new HashMap<String, Object>();
//	            HSSFRow row = sheet.getRow(rowIndex);
//	            //整行都为空去掉
//	            if(row==null) {
//	                continue;
//	            }
//	        }
//	    }
//	
//	
//	
//	  private void xlsxImp(InputStream inputStream, ArrayList<Object> arrayList) throws IOException {
//	        XSSFWorkbook xssfWorkbook = new XSSFWorkbook(inputStream);
//	        XSSFSheet sheet = xssfWorkbook.getSheetAt(0);
//	      
//	    }
//	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// @RequestMapping("/newImgUpload")
	// @ResponseBody
	// protected void doPost(HttpServletRequest req, HttpServletResponse resp)
	// throws ServletException, IOException {
	// //设置Response响应的编码
	// resp.setContentType("text/html; charset=UTF-8");
	//
	//
	// //获取一个Response的Write对象
	// PrintWriter writer = resp.getWriter();
	//
	//
	// //文件保存目录路径
	// String savePath = "D://icon";
	// System.out.println(savePath);
	//
	// //文件保存目录URL
	// String saveUrl = req.getContextPath() + "/a/";
	// System.out.print(saveUrl);
	//
	// //定义允许上传的文件扩展名
	// HashMap<String, String> extMap = new HashMap<String, String>();
	// extMap.put("image", "gif,jpg,jpeg,png,bmp");
	// extMap.put("flash", "swf,flv");
	// extMap.put("media", "swf,flv,mp3,wav,wma,wmv,mid,avi,mpg,asf,rm,rmvb");
	// extMap.put("file", "doc,docx,xls,xlsx,ppt,htm,html,txt,zip,rar,gz,bz2");
	//
	//
	// //最大文件大小
	// long maxSize = 1000000;
	//
	//
	// //判断是否是一个文件
	// if (!ServletFileUpload.isMultipartContent(req)) {
	// writer.println(getError("请选择文件。"));
	// return;
	// }
	// //检查目录
	// File uploadDir = new File(savePath);
	// if (!uploadDir.isDirectory()) {
	// writer.println(getError("上传目录不存在。"));
	// return;
	// }
	// //检查目录写权限
	// if (!uploadDir.canWrite()) {
	// writer.println(getError("上传目录没有写权限。"));
	// return;
	// }
	//
	// String dirName = req.getParameter("dir");
	// if (dirName == null) {
	// dirName = "image";
	// }
	// if (!extMap.containsKey(dirName)) {
	// writer.println(getError("目录名不正确。"));
	// return;
	// }
	//
	//
	// //创建文件夹
	// savePath += dirName + "/";
	// saveUrl += dirName + "/";
	// File saveDirFile = new File(savePath);
	// if (!saveDirFile.exists()) {
	// saveDirFile.mkdirs();
	// }
	// SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
	// String ymd = sdf.format(new Date());
	// savePath += ymd + "/";
	// saveUrl += ymd + "/";
	// File dirFile = new File(savePath);
	// if (!dirFile.exists()) {
	// dirFile.mkdirs();
	// }
	//
	// FileItemFactory factory = new DiskFileItemFactory();
	// ServletFileUpload upload = new ServletFileUpload(factory);
	// upload.setHeaderEncoding("UTF-8");
	// List items = null;
	// try {
	// items = upload.parseRequest((RequestContext) req);
	// } catch (FileUploadException e) {
	// e.printStackTrace();
	// }
	// Iterator itr = items.iterator();
	// while (itr.hasNext()) {
	// FileItem item = (FileItem) itr.next();
	// String fileName = item.getName();
	// long fileSize = item.getSize();
	// if (!item.isFormField()) {
	// //检查文件大小
	// if (item.getSize() > maxSize) {
	// writer.println(getError("上传文件大小超过限制。"));
	// return;
	// }
	// //检查扩展名
	// String fileExt = fileName.substring(fileName.lastIndexOf(".") +
	// 1).toLowerCase();
	// if
	// (!Arrays.<String>asList(extMap.get(dirName).split(",")).contains(fileExt))
	// {
	// writer.println(getError("上传文件扩展名是不允许的扩展名。\n只允许" + extMap.get(dirName) +
	// "格式。"));
	// return;
	// }
	//
	// SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
	// String newFileName = df.format(new Date()) + "_" + new
	// Random().nextInt(1000) + "." + fileExt;
	// try {
	// File uploadedFile = new File(savePath, newFileName);
	// item.write(uploadedFile);
	// } catch (Exception e) {
	// writer.println(getError("上传文件失败。"));
	// return;
	// }
	//
	// JSONObject obj = new JSONObject();
	// obj.put("error", 0);
	// obj.put("url", saveUrl + newFileName);
	// writer.println(obj.toJSONString());
	// }
	// }
	//
	//
	// //将writer对象中的内容输出
	// writer.flush();
	// //关闭writer对象
	// writer.close();
	// }
	//
	//
	// //一个私有的方法，用于响应错误信息
	// private String getError(String message) {
	// JSONObject obj = new JSONObject();
	// obj.put("error", 1);
	// obj.put("message", message);
	// return obj.toJSONString();
	// }
	//

	/*
	 * 查询所有学生信息
	 * 
	 * @return returnMap
	 */
//
//	@RequestMapping("/sad")
//	@ResponseBody
//	public Object searchDiseaseCodeing(@RequestParam String ejdmGlzd) {
//		Map<String, Object> returnMap = new HashMap();
//		ReflectUtils reflectUtils = new ReflectUtils();
//		List<Map> diseaseList = new ArrayList<>();
//		List<Edu000> edu000 = new ArrayList<>();
//		List<Edu001> allDiseases = administrationPageService.queryAllInformation();
//
//		List<String> list = new ArrayList<String>();
//		list = queryEdu000(ejdmGlzd);
//
//		Map<String, Object> std = new HashMap<>();
//		try {
//			std = reflectUtils.simpleReflectBeanToMap(allDiseases);
//		} catch (Exception e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//
//		return list;
//
//	}

	/*
	 * 根据传入的二级代码参数 获取二级代码将二级代码装入LIST中返回前台
	 * 
	 * @return returnMap
	 */

	public List<String> queryEdu000(String ejdmglzd) {
		List<Edu000> ejdm = administrationPageService.queryEjdm(ejdmglzd);
		List<String> relist = new ArrayList<String>();
		if (ejdm.size() > 0) {

			for (int i = 0; i < ejdm.size(); i++) {

				relist.add(String.valueOf(ejdm.get(i).getEjdmz()));

			}
		}
		return relist;
	}

}
