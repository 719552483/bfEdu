package com.beifen.edu.administration.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.servlet.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.alibaba.fastjson.JSON;
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
import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu300;
import com.beifen.edu.administration.domian.Edu301;
import com.beifen.edu.administration.domian.Edu400;
import com.beifen.edu.administration.domian.Edu401;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.domian.Edu991;
import com.beifen.edu.administration.domian.Edu993;
import com.beifen.edu.administration.service.AdministrationPageService;
import com.beifen.edu.administration.utility.ReflectUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;


/*
 * 业务处理Controller测试
 * */
@Controller
public class AdministrationController {

	@Autowired
	private AdministrationPageService administrationPageService;
	ReflectUtils utils = new ReflectUtils();

	/**
	 * 检查有没有系统用户
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/checkHaveSysUser")
	@ResponseBody
	public Object checkHaveSysUser() {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("haveSysUser", administrationPageService.checkHaveSysUser());
		return returnMap;
	}

	/**
	 * 注册系统用户
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/registerUser")
	@ResponseBody
	public Object registerUser(@RequestParam String username, @RequestParam String password) {
		Map<String, Object> returnMap = new HashMap();
		String sysRole = "sys";
		// 生成系统用户
		Edu990 edu990 = new Edu990();
		edu990.setJs(sysRole);
		edu990.setYhm(username);
		edu990.setMm(password);
		administrationPageService.newUser(edu990);

		// 生成系统用户权限
		Edu991 edu991 = new Edu991();
		edu991.setJs(sysRole);
		edu991.setAnqx(sysRole);
		edu991.setCdqx(sysRole);
		administrationPageService.addRole(edu991);

		// 获取系统用户保存在页面session信息
		Edu990 UserInfo = administrationPageService.getUserInfo(username);
		UserInfo.setScdlsj("fristTime");
		Edu991 authoritysInfo = administrationPageService.getAuthoritysInfo(edu990.getJs());

		returnMap.put("UserInfo", JSON.toJSONString(UserInfo));
		returnMap.put("authoritysInfo", JSON.toJSONString(authoritysInfo));
		returnMap.put("result", true);

		// 更新系统用户上次登陆时间
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
		UserInfo.setScdlsj(df.format(new Date()));
		administrationPageService.newUser(UserInfo);
		return returnMap;
	}

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
		Edu990 checkIsHaveUser = administrationPageService.checkIsHaveUser(username);
		String datebasePwd = administrationPageService.checkPwd(username);
		String ErroeTxt = "";
		// 用户不存在
		if (checkIsHaveUser == null) {
			result = false;
			ErroeTxt = "用户不存在";
			returnMap.put("result", result);
			returnMap.put("ErroeTxt", ErroeTxt);
		} else if (!password.equals(datebasePwd)) {
			result = false;
			ErroeTxt = "密码错误";
			returnMap.put("result", result);
			returnMap.put("ErroeTxt", ErroeTxt);
		} else if (checkIsHaveUser != null && password.equals(datebasePwd)) {
			result = true;
			Map<String, Object> UserInfo = new HashMap();
			Edu990 edu990 = administrationPageService.getUserInfo(username);
			Edu991 edu991 = administrationPageService.getAuthoritysInfo(edu990.getJs());
			if (edu990 != null && edu991 != null) {
				// 用户首次登陆
				if (edu990.getScdlsj() == null) {
					edu990.setScdlsj("fristTime");
				}
			}

			returnMap.put("UserInfo", JSON.toJSONString(edu990));
			returnMap.put("authoritysInfo", JSON.toJSONString(edu991));

			// 更新用户上次登陆时间
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
			edu990.setScdlsj(df.format(new Date()));
			administrationPageService.newUser(edu990);
			returnMap.put("result", result);
		}
		return returnMap;
	}

	/**
	 * 修改首页快捷方式
	 * 
	 * @param username用户名
	 * 
	 * @param password密码
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/newShortcut")
	@ResponseBody
	public Object newShortcut(@RequestParam String userId, @RequestParam String newShortcut) {
		boolean result = true;
		Map<String, Object> returnMap = new HashMap();
		administrationPageService.newShortcut(userId, newShortcut);
		returnMap.put("result", result);
		return returnMap;
	}

	/**
	 * 新增角色
	 * 
	 * @param newRoleInfo角色信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/addRole")
	@ResponseBody
	public Object addRole(@RequestParam String newRoleInfo) {
		boolean result = true;
		boolean jsHave = true;
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(newRoleInfo);
		Edu991 newRole = (Edu991) JSONObject.toBean(jsonObject, Edu991.class);
		// 判断角色名称是否存在
		Edu991 newRole2 = administrationPageService.getAuthoritysInfo(newRole.getJs());
		if (newRole2 == null) {
			jsHave = false;
			administrationPageService.addRole(newRole);
			returnMap.put("id", newRole.getBF991_ID());
		}

		returnMap.put("jsHave", jsHave);
		returnMap.put("result", result);
		return returnMap;
	}

	/**
	 * 修改角色
	 * 
	 * @param updateInfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/modifyRole")
	@ResponseBody
	public Object modifyRole(@RequestParam String updateInfo) {
		boolean result = true;
		boolean jsHave = true;
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(updateInfo);
		Edu991 newRole = (Edu991) JSONObject.toBean(jsonObject, Edu991.class);

		// 判断修改的角色名称是否存在
		Edu991 newRole2 = administrationPageService.getAuthoritysInfo(newRole.getJs());
		if (newRole2 == null) {
			jsHave = false;
		} else {
			if (newRole.getBF991_ID().equals(newRole2.getBF991_ID())) {
				jsHave = false;
			}
		}

		if (!jsHave) {
			administrationPageService.updateUserJs(newRole);
			administrationPageService.addRole(newRole);
		}

		returnMap.put("jsHave", jsHave);
		returnMap.put("result", result);
		return returnMap;
	}

	/**
	 * 删除角色
	 * 
	 * @param deleteIds删除id
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/removeRole")
	@ResponseBody
	public Object removeRole(@RequestParam String deleteIds) {
		Map<String, Object> returnMap = new HashMap();
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		boolean roleIsUse = false;

		// 查看角色当前是否有人使用
		for (int i = 0; i < deleteArray.size(); i++) {
			List<Edu990> useThisRoleEdu990s = administrationPageService
					.useThisRoleEdu990s(deleteArray.get(i).toString());
			if (useThisRoleEdu990s.size() > 0) {
				roleIsUse = true;
				break;
			}
		}

		if (!roleIsUse) {
			for (int i = 0; i < deleteArray.size(); i++) {
				administrationPageService.removeRole(deleteArray.get(i).toString());
			}
		}

		returnMap.put("roleIsUse", roleIsUse);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 获取所有角色（不包括系统用户角色）
	 * 
	 * @param newRoleInfo角色信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/getAllRole")
	@ResponseBody
	public Object getAllRole() {
		boolean result = true;
		Map<String, Object> returnMap = new HashMap();
		List<Edu991> allRoleInfo = administrationPageService.getAllRole();
		// 去掉sys角色
		for (int i = 0; i < allRoleInfo.size(); i++) {
			Edu991 edu991 = allRoleInfo.get(i);
			if (edu991.getJs().equals("sys")) {
				allRoleInfo.remove(i);
			}
		}

		returnMap.put("allRoleInfo", allRoleInfo);
		returnMap.put("result", result);
		return returnMap;
	}

	/**
	 * 获取所有用户（不包括系统用户）
	 * 
	 * @param newRoleInfo角色信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/getAllUser")
	@ResponseBody
	public Object getAllUser() {
		boolean result = true;
		Map<String, Object> returnMap = new HashMap();
		List<Edu990> allUser = administrationPageService.queryAllUser();
		// 去掉sys角色的用户
		for (int i = 0; i < allUser.size(); i++) {
			Edu990 edu990 = allUser.get(i);
			if (edu990.getJs().equals("sys")) {
				allUser.remove(i);
			}
		}
		returnMap.put("allUser", allUser);
		returnMap.put("result", result);
		return returnMap;
	}

	/**
	 * 根据用户id查询用户信息
	 * 
	 * @param newRoleInfo角色信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/queryUserById")
	@ResponseBody
	public Object queryUserById(@RequestParam("userId") String userId) {
		Map<String, Object> returnMap = new HashMap();
		Edu990 edu990 = administrationPageService.queryUserById(userId);
		returnMap.put("userInfo", edu990);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 新增用户
	 * 
	 * @param newRoleInfo角色信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/newUser")
	@ResponseBody
	public Object newUser(@RequestParam("newUserInfo") String newUserInfo) {
		boolean result = true;
		boolean userNameHave = true;
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(newUserInfo);
		Edu990 newUser = (Edu990) JSONObject.toBean(jsonObject, Edu990.class);
		// 判读用户名是否存在
		Edu990 edu990 = administrationPageService.checkIsHaveUser(newUser.getYhm());
		if (edu990 == null) {
			userNameHave = false;
			administrationPageService.newUser(newUser);
			returnMap.put("id", newUser.getBF990_ID());
		}

		returnMap.put("userNameHave", userNameHave);
		return returnMap;
	}

	/**
	 * 账号设置
	 * 
	 * @param newRoleInfo角色信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/userSetup")
	@ResponseBody
	public Object accountSetup(@RequestParam("accountSetupInfo") String accountSetupInfo) {
		boolean result = true;
		boolean userNameHave = true;
		boolean pwdRight = true;
		Map<String, Object> returnMap = new HashMap();
		JSONObject jsonObject = JSONObject.fromObject(accountSetupInfo);
		Edu990 newUser = (Edu990) JSONObject.toBean(jsonObject, Edu990.class);
		Edu990 otherUserInfo = administrationPageService.queryUserById(newUser.getBF990_ID().toString());
		newUser.setJs(otherUserInfo.getJs());
		newUser.setScdlsj(otherUserInfo.getScdlsj());
		newUser.setYxkjfs(otherUserInfo.getYxkjfs());
		// 判读用户名是否存在
		Edu990 edu990 = administrationPageService.checkIsHaveUser(newUser.getYhm());
		if (edu990 == null) {
			userNameHave = false;
		} else {
			if (newUser.getBF990_ID().equals(edu990.getBF990_ID())) {
				userNameHave = false;
			}
		}

		if (!userNameHave) {
			newUser.setJs(otherUserInfo.getJs());
			newUser.setScdlsj(otherUserInfo.getScdlsj());
			newUser.setYxkjfs(otherUserInfo.getYxkjfs());
			administrationPageService.newUser(newUser);
		}

		returnMap.put("result", result);
		returnMap.put("userNameHave", userNameHave);
		return returnMap;
	}

	/**
	 * 删除用户
	 * 
	 * @param deleteIds删除id
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/removeUser")
	@ResponseBody
	public Object removeUser(@RequestParam String deleteIds) {
		Map<String, Object> returnMap = new HashMap();
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeUser(deleteArray.get(i).toString());
		}
		returnMap.put("result", true);
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
		for (int i = 0; i < allClass.size(); i++) {
			if (allClass.get(i).getKcmc().equals(addClassInfo.getKcmc())) {
				nameHave = true;
				break;
			}
		}

		// 不存在则往数据库新增课程
		if (!nameHave) {
			String newClassStatus = "noStatus";
			String kcdm ="LNVCKC"+utils.getUUID(6)+utils.getRandom(2);
			long currentTimeStamp = System.currentTimeMillis();
			addClassInfo.setKcdm(kcdm);
			addClassInfo.setLrsj(currentTimeStamp);
			addClassInfo.setZt(newClassStatus);
			administrationPageService.addNewClass(addClassInfo);
			Long id = addClassInfo.getBF200_ID();
			returnMap.put("newId", id);
			returnMap.put("kcdm", kcdm);
			returnMap.put("lrsj", currentTimeStamp);
			returnMap.put("zt", newClassStatus);
		}
		returnMap.put("result", true);
		returnMap.put("nameHave", nameHave);
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
		for (int i = 0; i < allClass.size(); i++) {
			if (!allClass.get(i).getBF200_ID().equals(edu200.getBF200_ID())
					&& allClass.get(i).getKcmc().equals(edu200.getKcmc())) {
				nameHave = true;
				break;
			}
		}
		returnMap.put("nameHave", nameHave);
		// 不存在则修改数据
		if (!nameHave) {
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

		// 查询课程是否存在培养计划
		for (int i = 0; i < classArray.size(); i++) {
			boolean notInPlan = administrationPageService.classIsInCurturePlan(classArray.get(i).toString());
			if (notInPlan && !modifyStatus.equals("pass")) {
				returnMap.put("notInPlan", notInPlan);
				returnMap.put("result", true);
				return returnMap;
			}
		}

		// 不存在修改
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
		// 查询课程是否存在培养计划
		for (int i = 0; i < classArray.size(); i++) {
			isInPlan = administrationPageService.classIsInCurturePlan(classArray.get(i).toString());
			if (isInPlan) {
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
	 * 获得教学相关公共代码信息
	 */
	@RequestMapping("/getJxPublicCodes")
	@ResponseBody
	public Object getJxPublicCodes() {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("allXn", administrationPageService.queryAllXn());
		returnMap.put("allkj", administrationPageService.queryDefaultkjsz());
		
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 新增学年
	 */
	@RequestMapping("/addNewXn")
	@ResponseBody
	public Object addNewXn(@RequestParam String xninfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(xninfo);
		Edu400 edu400 = (Edu400) JSONObject.toBean(jsonObject, Edu400.class);
		List<Edu400> allXn=administrationPageService.queryAllXn();
		boolean nameHave = false;
		for (int i = 0; i < allXn.size(); i++) {
			if(allXn.get(i).getXnmc().equals(edu400.getXnmc())){
				nameHave=true;
				break;
			}
		}
		
		if(!nameHave){
			administrationPageService.addNewXn(edu400);
			returnMap.put("id", edu400.getEdu400_ID());
			returnMap.put("currentAllXn", administrationPageService.queryAllXn());
		}
		returnMap.put("nameHave", nameHave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 修改学年
	 */
	@RequestMapping("/modifyXn")
	@ResponseBody
	public Object modifyXn(@RequestParam String xninfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(xninfo);
		Edu400 edu400 = (Edu400) JSONObject.toBean(jsonObject, Edu400.class);
		List<Edu400> allXn=administrationPageService.queryAllXn();
		boolean nameHave = false;
		for (int i = 0; i < allXn.size(); i++) {
			if(!allXn.get(i).getEdu400_ID().equals(edu400.getEdu400_ID())&&
				allXn.get(i).getXnmc().equals(edu400.getXnmc())){
				nameHave=true;
				break;
			}
		}
		
		if(!nameHave){
			administrationPageService.addNewXn(edu400);
			returnMap.put("currentAllXn", administrationPageService.queryAllXn());
		}
		returnMap.put("nameHave", nameHave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 新增课节
	 */
	@RequestMapping("/addNewKj")
	@ResponseBody
	public Object addNewKj(@RequestParam String kjinfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(kjinfo);
		Edu401 edu401 = (Edu401) JSONObject.toBean(jsonObject, Edu401.class);
		List<Edu401> allKj=administrationPageService.queryAllKj();
		boolean nameHave = false;
		for (int i = 0; i < allKj.size(); i++) {
			if(allKj.get(i).getKjmc().equals(edu401.getKjmc())){
				nameHave=true;
				break;
			}
		}
		
		if(!nameHave){
			//获得新课节的顺序
			String kjsx=administrationPageService.getNewKjsh(edu401);
			edu401.setKjsx(kjsx);
			administrationPageService.addNewKj(edu401);
			returnMap.put("id", edu401.getEdu401_ID());
			returnMap.put("kjsx",kjsx);
		}
		returnMap.put("nameHave", nameHave);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 删除课节  
	 * 课节id唯一  所以不需要考虑是否选择了学年
	 */
	@RequestMapping("/rmoveKj")
	@ResponseBody
	public Object rmoveKj(@RequestParam String deleteId) {
		Map<String, Object> returnMap = new HashMap();
		
		boolean canRemove=true;
		//判断是否有课表正在使用该课节
		boolean verifyRelation= administrationPageService.verifyKj(deleteId);
		
		if(canRemove){
			//删除课节应该将所在时段其后所有课节的顺序减一  需要考虑是否选择了学年
			administrationPageService.addKjsxAterThisKj(deleteId);
			
			//删除课节
			administrationPageService.removeKj(deleteId);
		}
		returnMap.put("result", true);
		returnMap.put("canRemove", canRemove);
		return returnMap;
	}
	
	/**
	 * 修改课节名称
	 */
	@RequestMapping("/modifyKjMc")
	@ResponseBody
	public Object modifyKjMc(@RequestParam String newKjMc,@RequestParam String kjId) {
		Map<String, Object> returnMap = new HashMap();
		
		boolean nameHave=false;
		List<Edu401> allKj=administrationPageService.queryAllKj();
		for (int i = 0; i < allKj.size(); i++) {
			if(allKj.get(i).getKjmc().equals(newKjMc)&&
				!allKj.get(i).getKjmc().toString().equals(kjId)){
				nameHave=true;
				break;
			}
		}
		
		if(!nameHave){
			administrationPageService.modifyKjMc(newKjMc,kjId);
		}
		returnMap.put("result", true);
		returnMap.put("nameHave", nameHave);
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
			if (currentAllRelation.get(i).getPyjhmc().equals(edu107.getPyjhmc())) {
				relationNameHave = true;
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
		if (!have && !relationNameHave) {
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
			if (!currentAllRelation.get(i).getEdu107_ID().equals(edu107.getEdu107_ID())
					&& currentAllRelation.get(i).getPyjhmc().equals(edu107.getPyjhmc())) {
				relationNameHave = true;
				break;
			}

			if (!currentAllRelation.get(i).getEdu107_ID().equals(edu107.getEdu107_ID())
					&& currentAllRelation.get(i).getPyccbm().equals(edu107.getPyccbm())
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
		boolean canRemove=true;
		for (int i = 0; i < deleteArray.size(); i++) {
			boolean verifyRelation= administrationPageService.verifyRelation(deleteArray.get(i).toString());
			if(!verifyRelation){
				canRemove=false;
				break;
			}else{
				canRemove=true;
			}
		}
		
		if(canRemove){
			for (int i = 0; i < deleteArray.size(); i++) {
				administrationPageService.removeRelation(deleteArray.get(i).toString());
			}
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		returnMap.put("canRemove", canRemove);
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
			if (currentAllLevel.get(i).getPyccmc().equals(edu103.getPyccmc())) {
				namehave = true;
				break;
			}
			if (currentAllLevel.get(i).getPyccbm().equals(edu103.getPyccbm())) {
				codehave = true;
				break;
			}
		}
		
		if (!namehave&& !codehave) {
			String yxbz = "1";
			edu103.setYxbz(yxbz);
			administrationPageService.addNewLevel(edu103);
			Long id = edu103.getEdu103_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}
		returnMap.put("codehave", codehave);
		returnMap.put("namehave", namehave);
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
			if (!currentAllLevel.get(i).getEdu103_ID().equals(edu103.getEdu103_ID())
					&& currentAllLevel.get(i).getPyccmc().equals(edu103.getPyccmc())) {
				namehave = true;
				break;
			}
			
			if (!currentAllLevel.get(i).getEdu103_ID().equals(edu103.getEdu103_ID())
					&& currentAllLevel.get(i).getPyccbm().equals(edu103.getPyccbm())) {
				codehave = true;
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
		boolean canRemove=true;
		for (int i = 0; i < deleteArray.size(); i++) {
			boolean verifyLevel= administrationPageService.verifyLevel(deleteArray.get(i).toString());
			if(!verifyLevel){
				canRemove=false;
				break;
			}else{
				canRemove=true;
			}
		}
		
		if(canRemove){
			for (int i = 0; i < deleteArray.size(); i++) {
				administrationPageService.removeLevel(deleteArray.get(i).toString());
			}
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		returnMap.put("canRemove", canRemove);
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
			if (currentAllDeaparment.get(i).getXbmc().equals(edu104.getXbmc())) {
				namehave = true;
				break;
			}
			if (currentAllDeaparment.get(i).getXbbm().equals(edu104.getXbbm())) {
				codehave = true;
				break;
			}
		}

		if (!namehave&&!codehave) {
			String yxbz = "1";
			edu104.setYxbz(yxbz);
			administrationPageService.addNewDeaparment(edu104);
			Long id = edu104.getEdu104_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}
		returnMap.put("codehave", codehave);
		returnMap.put("namehave", namehave);
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
			if (!currentAllDeaparment.get(i).getEdu104_ID().equals(edu104.getEdu104_ID())
					&& currentAllDeaparment.get(i).getXbmc().equals(edu104.getXbmc())) {
				namehave = true;
				break;
			}
			if (!currentAllDeaparment.get(i).getEdu104_ID().equals(edu104.getEdu104_ID())
					&& currentAllDeaparment.get(i).getXbbm().equals(edu104.getXbbm())) {
				codehave = true;
				break;
			}
		}
		// 不存在则修改关系
		if (!namehave&&!codehave ) {
			administrationPageService.updateDeaparment(edu104);
		}
		returnMap.put("codehave", codehave);
		returnMap.put("namehave", namehave);
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
		boolean canRemove=true;
		for (int i = 0; i < deleteArray.size(); i++) {
			boolean verifyDeaparment= administrationPageService.verifyDeaparment(deleteArray.get(i).toString());
			if(!verifyDeaparment){
				canRemove=false;
				break;
			}else{
				canRemove=true;
			}
		}
		
		if(canRemove){
			for (int i = 0; i < deleteArray.size(); i++) {
				administrationPageService.removeDeaparment(deleteArray.get(i).toString());
			}
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		returnMap.put("canRemove", canRemove);
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
			if (currentAllGrade.get(i).getNjmc().equals(edu105.getNjmc())) {
				namehave = true;
				break;
			}
			if (currentAllGrade.get(i).getNjbm().equals(edu105.getNjbm())) {
				codehave = true;
				break;
			}
		}

		if (!namehave&&!codehave) {
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
			if (!currentAllGrade.get(i).getEdu105_ID().equals(edu105.getEdu105_ID())
					&& currentAllGrade.get(i).getNjmc().equals(edu105.getNjmc())) {
				namehave = true;
				break;
			}
			if (!currentAllGrade.get(i).getEdu105_ID().equals(edu105.getEdu105_ID())
					&& currentAllGrade.get(i).getNjbm().equals(edu105.getNjbm())) {
				codehave = true;
				break;
			}

		}
		// 不存在则修改关系
		if (!namehave&&!codehave) {
			administrationPageService.updateGrade(edu105);
		}

		returnMap.put("codehave", codehave);
		returnMap.put("namehave", namehave);
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
		boolean canRemove=true;
		for (int i = 0; i < deleteArray.size(); i++) {
			boolean verifyGrade= administrationPageService.verifyGrade(deleteArray.get(i).toString());
			if(!verifyGrade){
				canRemove=false;
				break;
			}else{
				canRemove=true;
			}
		}
		
		if(canRemove){
			for (int i = 0; i < deleteArray.size(); i++) {
				administrationPageService.removeGrade(deleteArray.get(i).toString());
			}
		}
		
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		returnMap.put("canRemove", canRemove);
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
		for (int i = 0; i < currentAllMajor.size(); i++) {
			if (currentAllMajor.get(i).getZymc().equals(edu106.getZymc())) {
				namehave = true;
				break;
			}
		}

		if (!namehave) {
			String yxbz = "1";
			edu106.setYxbz(yxbz);
			administrationPageService.addNewMajor(edu106);
			Long id = edu106.getEdu106_ID();
			returnMap.put("id", id);
			returnMap.put("yxbz", yxbz);
		}

		returnMap.put("namehave", namehave);
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
		for (int i = 0; i < currentAllMajor.size(); i++) {
			if (!currentAllMajor.get(i).getEdu106_ID().equals(edu106.getEdu106_ID())
					&& currentAllMajor.get(i).getZymc().equals(edu106.getZymc())) {
				namehave = true;
				break;
			}

		}
		// 不存在则修改关系
		if (!namehave) {
			administrationPageService.updateMajor(edu106);
		}

		returnMap.put("namehave", namehave);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 删除专业
	 * @param deleteIds删除ID
	 * @return returnMap
	 */
	@RequestMapping("removeMajor")
	@ResponseBody
	public Object deleteMajor(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		boolean canRemove=true;
		for (int i = 0; i < deleteArray.size(); i++) {
			boolean verifyMajor= administrationPageService.verifyMajor(deleteArray.get(i).toString());
			if(!verifyMajor){
				canRemove=false;
				break;
			}else{
				canRemove=true;
			}
		}
		
		if(canRemove){
			for (int i = 0; i < deleteArray.size(); i++) {
				administrationPageService.removeMajor(deleteArray.get(i).toString());
			}
		}
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("result", true);
		returnMap.put("canRemove", canRemove);
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
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

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
	public Object culturePlanAddCrouse(@RequestParam("culturePlanInfo") String culturePlanInfo,
			@RequestParam("crouseInfo") String crouseInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject crouse = JSONObject.fromObject(crouseInfo);
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		Edu108 edu108 = (Edu108) JSONObject.toBean(crouse, Edu108.class);

		// 通过 层次 系部 年级 专业定位培养计划
		// 获得培养计划ID
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

		String configTheCulturePlan = "F";// 初始化的是否生成开课计划
		String xbspTxt = "noStatus";// 初始化的系部审批
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
	 * 修改培养计划下的专业课程
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("modifyCultureCrose")
	@ResponseBody
	public Object modifyCultureCrose(@RequestParam("culturePlanInfo") String culturePlanInfo,
			@RequestParam("modifyInfo") String modifyInfo) {
		Map<String, Object> returnMap = new HashMap();
		// 根据层次等信息查出培养计划id
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

		// 查询培养计划下的所有专业课程
		List<Edu108> currentAllCultureCrose = administrationPageService.queryCulturePlanCouses(edu107ID);

		// 将修改信息转化为108实体
		JSONObject newCrouseInfo = JSONObject.fromObject(modifyInfo);
		Edu108 edu108 = (Edu108) JSONObject.toBean(newCrouseInfo, Edu108.class);

		// 判断课程信息是否冲突
		boolean namehave = false;
		boolean codehave = false;
		for (int i = 0; i < currentAllCultureCrose.size(); i++) {
			if (!currentAllCultureCrose.get(i).getEdu108_ID().equals(edu108.getEdu108_ID())
					&& currentAllCultureCrose.get(i).getKcmc().equals(edu108.getKcmc())) {
				namehave = true;
				break;
			}

			if (!currentAllCultureCrose.get(i).getEdu108_ID().equals(edu108.getEdu108_ID())
					&& currentAllCultureCrose.get(i).getKcdm().equals(edu108.getKcdm())) {
				codehave = true;
				break;
			}

		}
		// 不存在则修改关系
		if (!namehave && !codehave) {
			administrationPageService.updateCultureCrouse(edu108);
			administrationPageService.chengeCulturePlanCrouseStatus(edu108.getEdu108_ID().toString(), "noStatus");
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
		// 根据层次等信息查出培养计划id
		String levelCode = searchObject.getString("level");
		String departmentCode = searchObject.getString("department");
		String gradeCode = searchObject.getString("grade");
		String majorCode = searchObject.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

		// 填充搜索对象
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
		// 根据层次等信息查出培养计划id
		String levelCode = searchObject.getString("level");
		String departmentCode = searchObject.getString("department");
		String gradeCode = searchObject.getString("grade");
		String majorCode = searchObject.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

		// 填充搜索对象
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
		int changeType = modifyObject.getInt("changeType");
		// 获得更改的状态
		String status;
		if (changeType == 1) {
			status = "pass";
		} else if (changeType == 2) {
			status = "nopass";
		} else {
			status = "noStatus";
		}

		for (int i = 0; i < classArray.size(); i++) {
			administrationPageService.chengeCulturePlanCrouseStatus(classArray.get(i).toString(), status);
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
	public Object chengeCulturePlanCrouseFeedBack(@RequestParam String id, @RequestParam String feedBack) {
		// 获得更改的状态
		administrationPageService.chengeCulturePlanCrouseFeedBack(id, feedBack);
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

		// 判断行政班名称和编码是否已存在
		boolean namehave = false;
		boolean numhave = false;
		List<Integer> samePlanUseNums=new ArrayList<Integer>();
		for (int i = 0; i < currentAllAdministrationClasses.size(); i++) {
			if (currentAllAdministrationClasses.get(i).getPyccbm().equals(edu300.getPyccbm())
					&&currentAllAdministrationClasses.get(i).getXbbm().equals(edu300.getXbbm())
					&&currentAllAdministrationClasses.get(i).getNjbm().equals(edu300.getNjbm())
					&&currentAllAdministrationClasses.get(i).getZybm().equals(edu300.getZybm())
					&&currentAllAdministrationClasses.get(i).getZdybjxh().equals(edu300.getZdybjxh())
					)
				{
				numhave=true;
				break;
			}
			if (currentAllAdministrationClasses.get(i).getXzbmc().equals(edu300.getXzbmc())) {
				namehave = true;
				break;
			}
		}
		
//		int samePlanClassNum=0;
//		if(samePlanUseNums.size()!=0){
//			String removeStr= edu300.getNjbm();
//			String samePlanClassStr=String.valueOf(Collections.max(samePlanUseNums));
//			removeStr = samePlanClassStr.replace(removeStr,"");
//			samePlanClassNum=Integer.parseInt(removeStr);
//		}

		if (!namehave&&!numhave) {
			String xz =administrationPageService.queryXzByPyccbm(edu300.getPyccbm()); // 学制
			String currntNum=edu300.getZdybjxh(); //当前要是用的数字尾缀
			if(Integer.parseInt(edu300.getZdybjxh())<=9){
				currntNum =String.valueOf("0"+currntNum);
			}else{
				currntNum =String.valueOf(currntNum);
			}
			
			String yxbz = "1"; // 有效标志
			String configTheCulturePlan = "F";// 初始化的是否生成开课计划
			
			//班号  年级编码+（班级数+1）
			String bh =edu300.getNjbm()+currntNum;
		
			//班级代码
			String bjdm =xz+currntNum;
			
			//班级编码
			String bjbm =edu300.getNjbm()+edu300.getXbbm()+edu300.getZybm()+bjdm;
			
			String xqmc =administrationPageService.queryXqByPyccbm(1,edu300.getPyccbm()); // 校区名称
			String xqbm = administrationPageService.queryXqByPyccbm(2,edu300.getPyccbm()); // 校区编码
			
			edu300.setYxbz(yxbz);
			edu300.setSfsckkjh(configTheCulturePlan);
			edu300.setXqmc(xqmc);
			edu300.setXqbm(xqbm);
			edu300.setXzbbh(bh);
			edu300.setXzbdm(bjdm);
			edu300.setXzbbm(bjbm);
			administrationPageService.addAdministrationClass(edu300);
			Long id = edu300.getEdu300_ID();
			returnMap.put("yxbz", yxbz);
			returnMap.put("id", id);
			returnMap.put("xqmc", xqmc);
			returnMap.put("xqbm", xqbm);
			returnMap.put("sfsckkjh", configTheCulturePlan);
			returnMap.put("xzbbh", bh);
			returnMap.put("xzbdm", bjdm);
			returnMap.put("xzbbm", bjbm);
		}
		returnMap.put("numhave", numhave);
		returnMap.put("namehave", namehave);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 修改行政班
	 * 
	 * @param updateinfo修改信息
	 * 
	 * @return returnMap
	 */
	@RequestMapping("modifyAdministrationClass")
	@ResponseBody
	public Object modifyAdministrationClass(@RequestParam("culturePlanInfo") String culturePlanInfo,
			@RequestParam("modifyInfo") String modifyInfo) {
		Map<String, Object> returnMap = new HashMap();
		List<Edu300> currentAllAdministrationClasses = administrationPageService.queryAllAdministrationClasses();
		// 将修改信息转化为108实体
		JSONObject newCrouseInfo = JSONObject.fromObject(modifyInfo);
		Edu300 edu300 = (Edu300) JSONObject.toBean(newCrouseInfo, Edu300.class);
		// 判断是否冲突
		boolean namehave = false;
//		boolean codehave = false;

		for (int i = 0; i < currentAllAdministrationClasses.size(); i++) {
			if (!currentAllAdministrationClasses.get(i).getEdu300_ID().equals(edu300.getEdu300_ID())
					&& currentAllAdministrationClasses.get(i).getXzbmc().equals(edu300.getXzbmc())) {
				namehave = true;
				break;
			}

//			if (!currentAllAdministrationClasses.get(i).getEdu300_ID().equals(edu300.getEdu300_ID())
//					&& currentAllAdministrationClasses.get(i).getXzbbm().equals(edu300.getXzbbm())) {
//				codehave = true;
//				break;
//			}

		}
		// 不存在则修改
		if (!namehave) {
			administrationPageService.updateAdministrationClass(edu300);
		}

		returnMap.put("namehave", namehave);
//		returnMap.put("codehave", codehave);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 查询培养计划下的行政班
	 */
	@RequestMapping("/queryCulturePlanAdministrationClasses")
	@ResponseBody
	public Object queryCulturePlanAdministrationClasses(@RequestParam("culturePlanInfo") String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");

		List<Edu300> currentAllAdministrationClasses = administrationPageService
				.queryCulturePlanAdministrationClasses(levelCode, departmentCode, gradeCode, majorCode);
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
		List<Edu001> allStudent = administrationPageService.queryAllStudent();

		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeAdministrationClass(deleteArray.get(i).toString());
			administrationPageService.removeXZBAndUpdateStudentCorrelationInfo(allStudent,
					deleteArray.get(i).toString());
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
		// 根据层次等信息查出培养计划id
		String levelCode = searchObject.getString("level");
		String departmentCode = searchObject.getString("department");
		String gradeCode = searchObject.getString("grade");
		String majorCode = searchObject.getString("major");
		String className = searchObject.getString("className");

		// 填充搜索对象
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
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

		// 培养计划下的课程
		List<Edu108> couserInfo = administrationPageService.queryCulturePlanCouses(edu107ID);
		// 培养计划下的行政班
		List<Edu300> currentAllAdministrationClasses = administrationPageService
				.queryCulturePlanAdministrationClasses(levelCode, departmentCode, gradeCode, majorCode);
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

		String isGeneratCoursePlan = "T";
		// eud300 行政班更改开课计划属性
		for (int i = 0; i < classArray.size(); i++) {
			administrationPageService.generatAdministrationCoursePlan(classArray.get(i).toString(),
					isGeneratCoursePlan);
		}

		// eud180 课程更改开课计划属性
		for (int i = 0; i < edu108Ids.size(); i++) {
			administrationPageService.generatCoursePlan(edu108Ids.get(i).toString(), classNames.toString(),
					classArray.toString(), isGeneratCoursePlan);
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
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		long edu107ID = administrationPageService.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);

		// 查询培养计划下的行政班
		List<Edu300> administrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,departmentCode, gradeCode, majorCode);
		List<String> classNames = new ArrayList();
		List<String> classIds = new ArrayList();
		for (int i = 0; i < administrationClasses.size(); i++) {
			classNames.add(administrationClasses.get(i).getXzbmc());
			classIds.add(administrationClasses.get(i).getEdu300_ID().toString());
		}

		// 查询培养计划下所有课程
		List<Edu108> allCrouse = administrationPageService.queryCulturePlanCouses(edu107ID);
		String isGeneratCoursePlan = "T";
		List<Edu108> crouseInfo = new ArrayList();
		for (int i = 0; i < allCrouse.size(); i++) {
			// 课程通过审核则生成开课计划
			if (allCrouse.get(i).getXbsp().equals("pass")) {
				for (int g = 0; g < administrationClasses.size(); g++) {
					for (int c = 0; c < classIds.size(); c++) {
						// eud300 行政班更改开课计划属性
						administrationPageService.generatAdministrationCoursePlan(classIds.get(i), isGeneratCoursePlan);
					}

					// eud180 课程更改开课计划属性
					administrationPageService.generatCoursePlan(allCrouse.get(i).getEdu108_ID().toString(),
							JSONArray.fromObject(classNames).toString(), JSONArray.fromObject(classIds).toString(),
							isGeneratCoursePlan);
					Edu108 edu108 = allCrouse.get(i);
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
	 * 教学班管理 - 查询已生成开课计划的行政班班级库(指定培养计划)
	 */
	@RequestMapping("/teachingClassQueryAdministrationClassesLibrary")
	@ResponseBody
	public Object teachingClassQueryAdministrationClassesLibrary(
			@RequestParam("culturePlanInfo") String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		List<Map> classesInfo = new ArrayList(); // 组装返回信息
		/*
		 * 1.查询所有行政班 List<Edu300>
		 * 
		 * 2.查询培养计划 List<Edu108>
		 * 
		 * 3.行政班信息+课程信息 组装返回信息
		 * 
		 */
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		List<Edu300> allAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode, departmentCode, gradeCode, majorCode);

		// 组装行政班的培养计划信息
		for (int i = 0; i < allAdministrationClasses.size(); i++) {
			List<Edu108> palnInfos = administrationPageService.queryAdministrationClassesCrouse(allAdministrationClasses.get(i).getEdu300_ID().toString());
			for (int p = 0; p < palnInfos.size(); p++) {
				Map<String, Object> administrationClassesWithcrouseInfo = new HashMap();
				administrationClassesWithcrouseInfo.put("edu108_ID", palnInfos.get(p).getEdu108_ID());
				administrationClassesWithcrouseInfo.put("edu300_ID", allAdministrationClasses.get(i).getEdu300_ID());
//				administrationClassesWithcrouseInfo.put("xqmc", allAdministrationClasses.get(i).getXqmc());
//				administrationClassesWithcrouseInfo.put("xqbm", allAdministrationClasses.get(i).getXqbm());
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
				administrationClassesWithcrouseInfo.put("jxbrs", 0);
				administrationClassesWithcrouseInfo.put("jxbmc", "");
				classesInfo.add(administrationClassesWithcrouseInfo);
			}
		}

		returnMap.put("classesInfo", classesInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 教学班管理 - 查询已生成开课计划的行政班班级库(不指定培养计划)
	 */
	@RequestMapping("/getAllClassesLibrary")
	@ResponseBody
	public Object getAllClassesLibrary() {
		Map<String, Object> returnMap = new HashMap();
		List<Map> classesInfo = new ArrayList(); // 组装返回信息
		/*
		 * 1.查询所有行政班 List<Edu300>
		 * 
		 * 2.查询培养计划 List<Edu108>
		 * 
		 * 3.行政班信息+课程信息 组装返回信息
		 * 
		 */
		List<Edu300> allAdministrationClasses = administrationPageService.queryAllAdministrationClasses();
		// 组装行政班的培养计划信息
		for (int i = 0; i < allAdministrationClasses.size(); i++) {
			List<Edu108> palnInfos = administrationPageService.queryAdministrationClassesCrouse(allAdministrationClasses.get(i).getEdu300_ID().toString());
			for (int p = 0; p < palnInfos.size(); p++) {
				Map<String, Object> administrationClassesWithcrouseInfo = new HashMap();
				administrationClassesWithcrouseInfo.put("edu108_ID", palnInfos.get(p).getEdu108_ID());
				administrationClassesWithcrouseInfo.put("edu300_ID", allAdministrationClasses.get(i).getEdu300_ID());
				administrationClassesWithcrouseInfo.put("pycc", allAdministrationClasses.get(i).getPyccmc());
				administrationClassesWithcrouseInfo.put("pyccbm", allAdministrationClasses.get(i).getPyccbm());
				administrationClassesWithcrouseInfo.put("xb", allAdministrationClasses.get(i).getXbmc());
				administrationClassesWithcrouseInfo.put("xbbm", allAdministrationClasses.get(i).getXzbbm());
				administrationClassesWithcrouseInfo.put("nj", allAdministrationClasses.get(i).getNjmc());
				administrationClassesWithcrouseInfo.put("njbm", allAdministrationClasses.get(i).getNjbm());
				administrationClassesWithcrouseInfo.put("zymc", allAdministrationClasses.get(i).getZymc());
				administrationClassesWithcrouseInfo.put("zybm", allAdministrationClasses.get(i).getZybm());
//				administrationClassesWithcrouseInfo.put("xqmc", allAdministrationClasses.get(i).getXqmc());
//				administrationClassesWithcrouseInfo.put("xqbm", allAdministrationClasses.get(i).getXqbm());
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
				administrationClassesWithcrouseInfo.put("jxbrs", 0);
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
		JSONArray array = JSONArray.fromObject(verifyInfo); // 解析json字符
		List<Edu301> allTeachingClasses = administrationPageService.queryAllTeachingClass();
		List<Edu301> verifyList = new ArrayList<Edu301>();
		boolean willDropFirsthand = false; // 是否提示用户将删除原始教学班

		for (int i = 0; i < array.size(); i++) {
			JSONObject jsonObject = JSONObject.fromObject(array.getJSONObject(i));
			Edu301 verifyEdu301 = new Edu301();
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

		allforOver: for (int i = 0; i < verifyList.size(); i++) {
			Edu301 thisClassInfo = verifyList.get(i);

			if (thisClassInfo.getBhxsCode() != null && !thisClassInfo.getBhxsCode().equals("")) {
				// 按学生拆班的情况
				for (int a = 0; a < allTeachingClasses.size(); a++) {
					if (thisClassInfo.getEdu108_ID().equals(allTeachingClasses.get(a).getEdu108_ID())) {
						// 查询学生所在行政班
						String[] students = thisClassInfo.getBhxsCode().split(",");
						String currentTeachingClassesBhxzbCode = allTeachingClasses.get(a).getBhxzbid();
						for (int s = 0; s < students.length; s++) {
							String xzbCode = administrationPageService.queryStudentXzbCode(students[s]);
							// 如果学生所在行政班有教学班则提示用户将删除原始教学班
							if (xzbCode != null) {
								if (currentTeachingClassesBhxzbCode != null
										&& currentTeachingClassesBhxzbCode.indexOf(xzbCode) != -1) {
									willDropFirsthand = true;
									break allforOver;
								}
							}
						}
					}
				}
			} else {
				for (int a = 0; a < allTeachingClasses.size(); a++) {
					if (thisClassInfo.getEdu108_ID().equals(allTeachingClasses.get(a).getEdu108_ID())) {
						String currentTeachingClassesBhxzbCode = allTeachingClasses.get(a).getBhxzbid();
						String[] edu301BhxzbCode = thisClassInfo.getBhxzbid().split(",");
						for (int e = 0; e < edu301BhxzbCode.length; e++) {
							if (currentTeachingClassesBhxzbCode != null
									&& currentTeachingClassesBhxzbCode.indexOf(edu301BhxzbCode[e]) != -1) {
								willDropFirsthand = true;
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
		JSONArray array = JSONArray.fromObject(classInfo); // 解析json字符
		List<Edu301> verifyList = new ArrayList<Edu301>();
		for (int i = 0; i < array.size(); i++) {
			JSONObject jsonObject = JSONObject.fromObject(array.getJSONObject(i));
			Edu301 verifyEdu301 = new Edu301();
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
		String xzbcode = xzbCodeJson.getString("edu300_ID");
		if (xzbcode.equals("")) {
			studentInfos = administrationPageService.queryAllStudent();
		} else {
			if (xzbcode.indexOf(",") == -1) {
				List<Edu001> administrationClassStudents = administrationPageService
						.queryStudentInfoByAdministrationClass(xzbcode);
				for (int a = 0; a < administrationClassStudents.size(); a++) {
					Edu001 edu001 = administrationClassStudents.get(a);
					studentInfos.add(edu001);
				}
			} else {
				com.alibaba.fastjson.JSONArray xzbcodeArray = JSON.parseArray(xzbcode);
				for (int x = 0; x < xzbcodeArray.size(); x++) {
					List<Edu001> administrationClassStudents = administrationPageService
							.queryStudentInfoByAdministrationClass(xzbcodeArray.get(x).toString());
					for (int a = 0; a < administrationClassStudents.size(); a++) {
						Edu001 edu001 = administrationClassStudents.get(a);
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
		// 根据层次等信息查出培养计划id
		String xzbcode = searchObject.getString("xzbcode");
		String xb = searchObject.getString("xb");
		String ztCode = searchObject.getString("zt");
		String xm = searchObject.getString("xm");

		// 填充搜索对象
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
	 * 查询所有教学班(指定培养计划)
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
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");

		List<Edu301> calssInfo = administrationPageService.getCulturePlanAllTeachingClasses(levelCode, departmentCode,gradeCode, majorCode);
		returnMap.put("calssInfo", calssInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 查询所有教学班(不指定培养计划)
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("getAllTeachingClasses2")
	@ResponseBody
	public Object getAllTeachingClasses2() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu301> calssInfo = administrationPageService.getAllTeachingClasses();
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
		String teachingClassID = modifyInfo.getString("teachingClassID");
		String newName = modifyInfo.getString("newName");

		List<Edu301> calssInfo = administrationPageService.getAllTeachingClasses();
		for (int a = 0; a < calssInfo.size(); a++) {
			if (newName.equals(calssInfo.get(a).getJxbmc())) {
				namehave = true;
				break;
			}
		}

		if (!namehave) {
			administrationPageService.modifyTeachingClassName(teachingClassID, newName);
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
		List<Edu001> allStudent = administrationPageService.queryAllStudent();
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeTeachingClassByID(deleteArray.get(i).toString());
			administrationPageService.updateStudentTeachingClassInfo(allStudent, deleteArray.get(i).toString());
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
		// 根据层次等信息查出培养计划id
		String className = searchObject.getString("className");
		String coursesName = searchObject.getString("coursesName");

		// 填充搜索对象
		Edu301 edu301 = new Edu301();
		edu301.setJxbmc(className);
		edu301.setKcmc(coursesName);
		List<Edu301> tableInfo = administrationPageService.searchTeachingClass(edu301,false);
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
	public Object searchTeachingClassQueryAdministrationClassesLibrary(@RequestParam String SearchCriteria,
			@RequestParam String culturePlanInfo) {

		Map<String, Object> returnMap = new HashMap();
		List<Map> classesInfo = new ArrayList(); // 组装返回信息
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		String xzbmc = searchObject.getString("xzbmc");
		String kcmc = searchObject.getString("kcmc");

		List<Edu300> allAdministrationClasses = new ArrayList<Edu300>();
		if (!xzbmc.equals("")) {
			Edu300 edu300 = new Edu300();
			edu300.setPyccbm(levelCode);
			edu300.setXbbm(departmentCode);
			edu300.setNjbm(gradeCode);
			edu300.setZybm(majorCode);
			edu300.setXzbmc(xzbmc);
			allAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClassesWithXZBMC(edu300);
		} else {
			allAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,
					departmentCode, gradeCode, majorCode);
		}

		// 组装行政班的培养计划信息
		for (int i = 0; i < allAdministrationClasses.size(); i++) {
			List<Edu108> palnInfos = new ArrayList<Edu108>();
			if (!kcmc.equals("")) {
				Edu108 edu108 = new Edu108();
				edu108.setEdu300_ID(allAdministrationClasses.get(i).getEdu300_ID().toString());
				edu108.setKcmc(kcmc);
				palnInfos = administrationPageService.queryAdministrationClassesCrouseWithKCMC(edu108);
			} else {
				palnInfos = administrationPageService
						.queryAdministrationClassesCrouse(allAdministrationClasses.get(i).getEdu300_ID().toString());
			}

			for (int p = 0; p < palnInfos.size(); p++) {
				Map<String, Object> administrationClassesWithcrouseInfo = new HashMap();
				administrationClassesWithcrouseInfo.put("edu108_ID", palnInfos.get(p).getEdu108_ID());
				administrationClassesWithcrouseInfo.put("edu300_ID", allAdministrationClasses.get(i).getEdu300_ID());
//				administrationClassesWithcrouseInfo.put("xqmc", allAdministrationClasses.get(i).getXqmc());
//				administrationClassesWithcrouseInfo.put("xqbm", allAdministrationClasses.get(i).getXqbm());
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
				administrationClassesWithcrouseInfo.put("jxbrs", 0);
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
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");

		List<Edu001> studentInfo = administrationPageService.queryCulturePlanStudent(levelCode, departmentCode,
				gradeCode, majorCode);
		List<Edu300> classInfo = administrationPageService.queryCulturePlanAdministrationClasses(levelCode,
				departmentCode, gradeCode, majorCode);
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
//		boolean xhhave = false;
		// 判断新增学生是否会超过行政班容纳人数
		boolean studentSpill = administrationPageService.administrationClassesIsSpill(edu001.getEdu300_ID());
//		for (int i = 0; i < currentAllStudent.size(); i++) {
//			if (currentAllStudent.get(i).getXh().equals(edu001.getXh())) {
//				xhhave = true;
//				break;
//			}
//		}
		// 判断身份证是否存在
		boolean IDcardIshave = administrationPageService.IDcardIshave(edu001.getSfzh());
		String newNh="";
		if (!studentSpill && !IDcardIshave) {
			newNh = administrationPageService.getNewStudentXh(edu001.getEdu300_ID()); //新生的学号
			String yxbz = "1";
			edu001.setYxbz(yxbz);
			edu001.setXh(newNh);
			administrationPageService.addStudent(edu001); // 新增学生
			Long newStudentid = edu001.getEdu001_ID();

			List<Edu301> teachingClassesBy300id = administrationPageService.queryTeachingClassByXzbCode(edu001.getEdu300_ID());
			String xzbid = edu001.getEdu300_ID();
			administrationPageService.addStudentUpdateCorrelationInfo(teachingClassesBy300id, xzbid);

			returnMap.put("id", newStudentid);
			returnMap.put("yxbz", yxbz);
		}

		returnMap.put("IDcardIshave", IDcardIshave);
		returnMap.put("newNh", newNh);
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
		JSONArray deleteArray = JSONArray.fromObject(removeInfo); // 解析json字符
		for (int i = 0; i < deleteArray.size(); i++) {
			JSONObject jsonObject = deleteArray.getJSONObject(i);
			String edu300_ID = jsonObject.getString("edu300_ID");
			long studentId = jsonObject.getLong("studentId");

			List<Edu301> teachingClassesBy300id = administrationPageService.queryTeachingClassByXzbCode(edu300_ID);
			List<Edu301> teachingClassesBy001id = administrationPageService
					.queryTeachingClassByXSCode(String.valueOf(studentId));
			administrationPageService.removeStudentUpdateCorrelationInfo(teachingClassesBy300id, teachingClassesBy001id,
					edu300_ID, studentId);
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
//		boolean xhhave = false;
//		for (int i = 0; i < currentAllStudent.size(); i++) {
//			if (!currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())
//					&& currentAllStudent.get(i).getXh().equals(edu001.getXh())) {
//				xhhave = true;
//				break;
//			}
//		}
		
		// 判断身份证是否存在
		boolean IdcardHave= false;
		for (int i = 0; i < currentAllStudent.size(); i++) {
			if (!currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())
					&& currentAllStudent.get(i).getSfzh().equals(edu001.getSfzh())) {
				IdcardHave = true;
				break;
			}
		}
	

		// 判断是否改变行政班
		boolean isChangeXZB = false;
		for (int i = 0; i < currentAllStudent.size(); i++) {
			if (currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())) {
				if (currentAllStudent.get(i).getEdu300_ID() == null
						|| currentAllStudent.get(i).getEdu300_ID().equals("")) {
					isChangeXZB = true;
					break;
				} else {
					if (!currentAllStudent.get(i).getEdu300_ID().equals(edu001.getEdu300_ID())) {
						isChangeXZB = true;
						break;
					}
				}
			}
		}
		
		boolean studentSpill=false;
		// 不存在则修改学生
		if (!IdcardHave) {
			if (!isChangeXZB) {
				// 没有修改行政班的情况
				administrationPageService.addStudent(edu001);
			} else {
				// 判断修改是否会超过行政班容纳人数
				studentSpill = administrationPageService.administrationClassesIsSpill(edu001.getEdu300_ID());
			    if(!studentSpill){
			    	administrationPageService.updateStudent(edu001);
			    }
			}
		}

		returnMap.put("studentSpill", studentSpill);
//		returnMap.put("xhhave", xhhave);
		returnMap.put("IdcardHave", IdcardHave);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 下载学生导入模板
	 * 
	 * @return returnMap
	 * @throws IOException
	 * @throws ParseException 
	 */
	@RequestMapping("downloadStudentModal")
	@ResponseBody
	public void downloadStudentModal(HttpServletRequest request,HttpServletResponse response) throws IOException, ParseException {
		//创建Excel文件
		XSSFWorkbook workbook  = new XSSFWorkbook();
		utils.createImportStudentModal(workbook);
		boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
		String fileName="";
		if(isIE){
			fileName="ImportStudent";
		}else{
			fileName="导入学生模板";
		}
        utils.loadImportStudentModal(response,fileName, workbook);
	}
	
	/**
	 * 下载学生更新模板
	 * 
	 * @return returnMap
	 * @throws ParseException 
	 * @throws Exception 
	 */
	@RequestMapping("downloadModifyStudentsModal")
	@ResponseBody
	public void downloadModifyStudentsModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "modifyStudentIDs") String modifyStudentIDs) throws IOException, ParseException {
		// 根据ID查询已选学生信息
		com.alibaba.fastjson.JSONArray modifyStudentArray = JSON.parseArray(modifyStudentIDs);
		List<Edu001> chosedStudents=new ArrayList<Edu001>();
		for (int i = 0; i < modifyStudentArray.size(); i++) {
			Edu001 edu001=administrationPageService.queryStudentBy001ID(modifyStudentArray.get(i).toString());
			chosedStudents.add(edu001);
		}
		boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
		String fileName="";
		if(isIE){
			fileName="modifyStudents";
		}else{
			fileName="批量更新学生模板";
		}
		//创建Excel文件
		XSSFWorkbook workbook  = new XSSFWorkbook();
		utils.createModifyStudentModal(workbook,chosedStudents);
        utils.loadImportStudentModal(response,fileName, workbook);
	}
	
	/**
	 * 导入学生
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 * @throws Exception
	 * @throws ServletException
	 */
	@RequestMapping("importStudent")
	@ResponseBody
	public Object importStudent(@RequestParam("file") MultipartFile file) throws Exception {
		Map<String, Object> returnMap = utils.checkFile(file, "ImportEdu001", "导入学生信息");
		boolean modalPass = (boolean) returnMap.get("modalPass");
		if (!modalPass) {
			return returnMap;
		}

		if(!returnMap.get("dataCheck").equals("")){
			boolean dataCheck = (boolean) returnMap.get("dataCheck");
			if (!dataCheck) {
				return returnMap;
			}
		}
		
        if(!returnMap.get("importStudent").equals("")){
        	List<Edu001> importStudent = (List<Edu001>) returnMap.get("importStudent");
        	String yxbz = "1";
    		for (int i = 0; i < importStudent.size(); i++) {
    			Edu001 edu001 = importStudent.get(i);
    			edu001.setYxbz(yxbz);
    			administrationPageService.addStudent(edu001); // 新增学生
    			List<Edu301> teachingClassesBy300id = administrationPageService.queryTeachingClassByXzbCode(edu001.getEdu300_ID());
    			String xzbid = edu001.getEdu300_ID();
    			administrationPageService.addStudentUpdateCorrelationInfo(teachingClassesBy300id, xzbid);
    		}
        }
		return returnMap;
	}
	
	/**
	 * 批量修改学生
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 * @throws Exception
	 * @throws ServletException
	 */
	@RequestMapping("modifyStudents")
	@ResponseBody
	public Object modifyStudents(@RequestParam("file") MultipartFile file) throws Exception {
		Map<String, Object> returnMap = utils.checkFile(file, "ModifyEdu001", "已选学生信息");
		boolean modalPass = (boolean) returnMap.get("modalPass");
		if (!modalPass) {
			return returnMap;
		}

		if(!returnMap.get("dataCheck").equals("")){
			boolean dataCheck = (boolean) returnMap.get("dataCheck");
			if (!dataCheck) {
				return returnMap;
			}
		}
		
        if(!returnMap.get("importStudent").equals("")){
        	List<Edu001> modifyStudents = (List<Edu001>) returnMap.get("importStudent");
        	for (int i = 0; i < modifyStudents.size(); i++) {
        		administrationPageService.updateStudent(modifyStudents.get(i)); //修改学生
        	}
        	returnMap.put("modifyStudentsInfo", modifyStudents);
        }
		return returnMap;
	}

	/**
	 * 检验导入学生的文件
	 * 
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
		Map<String, Object> checkRS = utils.checkFile(file, "ImportEdu001", "导入学生信息");
		checkRS.put("result", true);
		return checkRS;
	}
	
	/**
	 * 检验修改学生的文件
	 * 
	 * 
	 * @return returnMap
	 * @throws ParseException
	 * @throws Exception
	 * @throws ServletException
	 */
	@RequestMapping("verifiyModifyStudentFile")
	@ResponseBody
	public Object verifiyModifyStudentFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		Map<String, Object> checkRS = utils.checkFile(file, "ModifyEdu001", "已选学生信息");
		checkRS.put("result", true);
		return checkRS;
	}

	
	
	
	/**
	 * 批量发放毕业证
	 * 
	 * @param deleteIds删除id
	 * 
	 * @return returnMap
	 */
	@RequestMapping("/graduationStudents")
	@ResponseBody
	public Object graduationStudents(@RequestParam String choosendStudents) {
		Map<String, Object> returnMap = new HashMap();
		com.alibaba.fastjson.JSONArray graduationArray = JSON.parseArray(choosendStudents);
		for (int i = 0; i < graduationArray.size(); i++) {
			administrationPageService.graduationStudents(graduationArray.get(i).toString());
		}
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 学生管理搜索学生
	 * 
	 * @param SearchCriteria
	 *            搜索条件
	 * @return returnMap
	 */
	@RequestMapping("studentMangerSearchStudent")
	@ResponseBody
	public Object studentMangerSearchStudent(@RequestParam String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		// 根据层次等信息查出培养计划id
		String level = searchObject.getString("level");
		String department = searchObject.getString("department");
		String grade = searchObject.getString("grade");
		String major = searchObject.getString("major");
		String administrationClass = searchObject.getString("administrationClass");
		String status = searchObject.getString("status");
		String studentNumber = searchObject.getString("studentNumber");
		String studentName = searchObject.getString("studentName");
		String studentRollNumber = searchObject.getString("studentRollNumber");
		String className = searchObject.getString("className");

		// 填充搜索对象
		Edu001 edu001 = new Edu001();
		edu001.setPycc(level);
		edu001.setSzxb(department);
		edu001.setNj(grade);
		edu001.setZybm(major);
		edu001.setEdu300_ID(administrationClass);
		edu001.setZtCode(status);
		edu001.setXh(studentNumber);
		edu001.setXm(studentName);
		edu001.setXjh(studentRollNumber);
		edu001.setXzbname(className);
	
		List<Edu001> studentInfo = administrationPageService.studentMangerSearchStudent(edu001);
		returnMap.put("studentInfo", studentInfo);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 发布消息时上传图片
	 * 
	 * @throws FileUploadException
	 * 
	 */
	@RequestMapping("newsImgUpload")
	@ResponseBody
	public void uploadFile(HttpServletRequest request, HttpServletResponse response) throws IOException {
		MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
		Map<String, MultipartFile> fileMap = multipartRequest.getFileMap();
		PrintWriter out = response.getWriter();
		
        String savePath = new File(this.getClass().getResource("/").getPath()).toString()+"/static/";
	
		// 定义允许上传的文件扩展名
		HashMap<String, String> extMap = new HashMap<String, String>();
		extMap.put("image", "gif,jpg,jpeg,png,bmp");

		// 最大文件大小
		long maxSize = 1000000;

		response.setContentType("text/html; charset=UTF-8");

		//检查是否是文件 
		if (!ServletFileUpload.isMultipartContent(request)) {
			out.println(utils.getError("Please select the file!"));
			return;
		}
		
		// 检查目录
		File uploadDir = new File(savePath);
		if (!uploadDir.isDirectory()) {
			// 如果不存在，创建文件夹
			if (!uploadDir.exists()) {
				uploadDir.mkdirs();
			} else {
				out.println(utils.getError("The Upload Directory Does Not Exist!"));
				return;
			}
		}
		// 检查目录写权限
		if (!uploadDir.canWrite()) {
			out.println(utils.getError("There is no write permission to upload the directory!"));
			return;
		}

		String dirName = request.getParameter("dir");
		if (dirName == null) {
			dirName = "image";
		}
		if (!extMap.containsKey(dirName)) {
			out.println(utils.getError("The directory name is incorrect!"));
			return;
		}
		
		
		// 创建文件夹
		savePath += dirName + "/";
		File saveDirFile = new File(savePath);
		if (!saveDirFile.exists()) {
			saveDirFile.mkdirs();
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String ymd = sdf.format(new Date());
		savePath += ymd + "/";
		File dirFile = new File(savePath);
		if (!dirFile.exists()) {
			dirFile.mkdirs();
		}
		// 此处是直接采用Spring的上传
		for (Map.Entry<String, MultipartFile> entity : fileMap.entrySet()) {
			MultipartFile mf = entity.getValue();
			String fileFullname = mf.getOriginalFilename();
			fileFullname = fileFullname.replace('&', 'a');
			fileFullname = fileFullname.replace(',', 'b');
			fileFullname = fileFullname.replace('，', 'c');
			// 检查扩展名
			String fileExt = fileFullname.substring(fileFullname.lastIndexOf(".") + 1).toLowerCase();
			if (!Arrays.<String> asList(extMap.get(dirName).split(",")).contains(fileExt)) {
				out.println(utils.getError("File format not supported!\nOnly " + extMap.get(dirName)));
				return;
			}
			
			//检查文件大小
			if(mf.getSize() > maxSize){
				out.println(utils.getError("Upload file size exceeds limit"));
				return;
			}

			SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmss");
			String newFileName = df.format(new Date()) + "_" + new Random().nextInt(1000) + "." + fileExt;

			File uploadFile = new File(savePath + newFileName);
			try {
				FileCopyUtils.copy(mf.getBytes(), uploadFile);
				JSONObject obj = new JSONObject();
				obj.put("error", 0);
				obj.put("url", dirName + "/"+ymd+"/"+newFileName);
				out.println(obj.toString());
			} catch (IOException e) {
				e.printStackTrace();
				out.println(utils.getError("Upload failed"));
				return;
			}
		}
		// 上传结束
	}
	
	/**
	 * 获取所有通知
	 * @return returnMap
	 */
	@RequestMapping("getNotices")
	@ResponseBody
	public Object getNotices() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu993> allNotices=administrationPageService.getNotices();
		returnMap.put("allNotices", allNotices);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 根据id获取通知
	 * @return returnMap
	 */
	@RequestMapping("getNoteInfoById")
	@ResponseBody
	public Object getNoteInfoById(@RequestParam("noteId") String noteId) {
		Map<String, Object> returnMap = new HashMap();
		Edu993 currentNoteInfo=administrationPageService.getNoteInfoById(noteId);
		returnMap.put("currentNoteInfo", currentNoteInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 发布通知
	 * 
	 * @param deleteIds删除ID
	 * 
	 * @return returnMap
	 * @throws ParseException
	 * @throws Exception
	 * @throws ServletException
	 */
	@RequestMapping("issueNotice")
	@ResponseBody
	public Object issueNotice(@RequestParam("noticeInfo") String noticeInfo,HttpServletRequest request)throws java.lang.IllegalArgumentException{
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(noticeInfo);
		Edu993 edu993 = (Edu993) JSONObject.toBean(jsonObject, Edu993.class);
		Date date = new Date();
		SimpleDateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		edu993.setFbsj(dateFormat.format(date));
		administrationPageService.issueNotice(edu993);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 改变消息是否在首页展示
	 * @return returnMap
	 */
	@RequestMapping("changeNoticeIsShowIndex")
	@ResponseBody
	public Object changeNoticeIsShowIndex(@RequestParam("noticeId") String noticeId,@RequestParam("isShow") String isShow) {
		Map<String, Object> returnMap = new HashMap();
		administrationPageService.changeNoticeIsShowIndex(noticeId,isShow);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 删除通知
	 * @return returnMap
	 */
	@RequestMapping("removeNotices")
	@ResponseBody
	public Object removeNotices(@RequestParam("removeInfo") String removeInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONArray deleteArray = JSONArray.fromObject(removeInfo); // 解析json字符
		String imgRootPath = new File(this.getClass().getResource("/").getPath()).toString()+"/static/";
		
		for (int i = 0; i < deleteArray.size(); i++) {
			Edu993 currentNoteInfo=administrationPageService.getNoteInfoById(deleteArray.get(i).toString());
			String noticeBody=currentNoteInfo.getTzzt();
			List<String> imgSrcs=utils.getImgSrc(noticeBody);
				for (int img = 0; img < imgSrcs.size(); img++) {
					//只删除插入的图片 不删除表情
					if(imgSrcs.get(img).startsWith("image")){
						File file = new File(imgRootPath+imgSrcs.get(img));
				        if (file.exists()) {
				        	 if (file.delete()) {
				        		 System.out.println("通知附带图片删除成功");
				        	 }
				        }
					}
				}
			administrationPageService.removeNotices(deleteArray.get(i).toString());
		}
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 获取可供发布的教学任务书
	 * @return returnMap
	 */
	@RequestMapping("getTaskInfo")
	@ResponseBody
	public Object getTaskInfo(@RequestParam("searchInfo") String searchInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(searchInfo);
		String xzbmc = searchObject.getString("xzbmc");
		String kcmc = searchObject.getString("kcmc");
		Edu301 edu301=new Edu301();
		edu301.setBhxzbmc(xzbmc);
		edu301.setKcmc(kcmc);
		List<Edu301> jxbInfo = administrationPageService.searchTeachingClass(edu301,true);
		returnMap.put("taskInfo", administrationPageService.getTaskInfo(jxbInfo));
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 获得部门信息
	 * @return returnMap
	 */
	@RequestMapping("getKkbmInfo")
	@ResponseBody
	public Object getKkbmInfo(@RequestParam("ejdmGlzd") String ejdmGlzd) {
		Map<String, Object> returnMap = new HashMap();
		List<Edu000> bmInfo = administrationPageService.queryEjdm(ejdmGlzd);
		returnMap.put("bmInfo", bmInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 发布教学任务书
	 * @return returnMap
	 */
	@RequestMapping("putOutTask")
	@ResponseBody
	public Object putOutTask(@RequestParam("taskInfo") String taskInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONArray array = JSONArray.fromObject(taskInfo); // 解析json字符
		for (int i = 0; i < array.size(); i++) {
			JSONObject jsonObject = JSONObject.fromObject(array.getJSONObject(i));
			Edu201 edu201 = new Edu201();
			edu201.setEdu108_ID(jsonObject.getLong("edu108_ID"));
			edu201.setEdu301_ID(jsonObject.getLong("edu301_ID"));
			edu201.setJxbmc(jsonObject.getString("jxbmc"));
			edu201.setKcmc(jsonObject.getString("kcmc"));
			edu201.setZymc(jsonObject.getString("zymc"));
			edu201.setJxbrs(jsonObject.getString("jxbrs"));
			edu201.setXzbmc(jsonObject.getString("xzbmc"));
			edu201.setZxs(jsonObject.getString("zxs"));
			edu201.setLs(jsonObject.getString("ls"));
			edu201.setLsmc(jsonObject.getString("lsmc"));
			edu201.setZyls(jsonObject.getString("zyls"));
			edu201.setZylsmc(jsonObject.getString("zylsmc"));
			edu201.setPkbm(jsonObject.getString("pkbm"));
			edu201.setPkbmCode(jsonObject.getString("pkbmCode"));
			edu201.setKkbm(jsonObject.getString("kkbm"));
			edu201.setKkbmCode(jsonObject.getString("kkbmCode"));
			edu201.setSfxylcj(jsonObject.getString("sfxylcj"));
			edu201.setSszt("noStatus");
			administrationPageService.putOutTask(edu201);
			administrationPageService.putOutTaskAction(edu201.getEdu301_ID(),edu201.getEdu201_ID());
		}
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 * 查看已发布任务书
	 * @return returnMap
	 */
	@RequestMapping("queryPutedTasks")
	@ResponseBody
	public Object queryPutedTasks() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu201> taskInfo = administrationPageService.queryPutedTasks();
		returnMap.put("taskInfo", taskInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 删除教学任务书
	 * @return returnMap
	 */
	@RequestMapping("removeTasks")
	@ResponseBody
	public Object removeTasks(@RequestParam("removeInfo") String removeInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONArray deleteArray = JSONArray.fromObject(removeInfo); // 解析json字符
		for (int i = 0; i< deleteArray.size(); i++) {
			 administrationPageService.removeTasks(deleteArray.get(i).toString());
		}
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 根据ID查询任务书
	 * @return returnMap
	 */
	@RequestMapping("queryTaskByID")
	@ResponseBody
	public Object queryTaskByID(@RequestParam("ID") String ID) {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("taskInfo", administrationPageService.queryTaskByID(ID));
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 根据ID修改任务书
	 * @return returnMap
	 */
	@RequestMapping("modifyTask")
	@ResponseBody
	public Object modifyTask(@RequestParam("modifyInfo") String modifyInfo) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(modifyInfo);
		Edu201 edu201 = (Edu201) JSONObject.toBean(jsonObject, Edu201.class);
		administrationPageService.putOutTask(edu201);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 检索已发布的教学任务书
	 * @return returnMap
	 */
	@RequestMapping("searchPutOutTasks")
	@ResponseBody
	public Object searchPutOutTasks(@RequestParam("SearchCriteria") String SearchCriteria) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		String xzbmc = searchObject.getString("xzbmc");
		String kcmc = searchObject.getString("kcmc");
		String sszt = searchObject.getString("sszt");
		Edu201 edu201=new Edu201();
		edu201.setXzbmc(xzbmc);
		edu201.setKcmc(kcmc);
		edu201.setSszt(sszt);
		List<Edu201> taskInfo = administrationPageService.searchPutOutTasks(edu201);
		returnMap.put("taskInfo", taskInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 任务书反馈意见
	 * @return returnMap
	 */
	@RequestMapping("chengeTaskFfkyj")
	@ResponseBody
	public Object chengeTaskFfkyj(@RequestParam("id") String id,@RequestParam("feedBack") String feedBack) {
		Map<String, Object> returnMap = new HashMap();
		// 获得更改的意见
		administrationPageService.chengeTaskFfkyj(id, feedBack);
		returnMap.put("result", true);
		return returnMap;
	}
	
	/**
	 * 修改任务书状态
	 * @return returnMap
	 */
	@RequestMapping("changeTaskStatus")
	@ResponseBody
	public Object changeTaskStatus(@RequestParam("choosedIds") String choosedIds,@RequestParam("status") String status) {
		Map<String, Object> returnMap = new HashMap();
		JSONArray choosedIdArray = JSONArray.fromObject(choosedIds); // 解析json字符
		for (int i = 0; i< choosedIdArray.size(); i++) {
			administrationPageService.changeTaskStatus(choosedIdArray.get(i).toString(), status);
		}
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	/**
	 * 根据层次关系查询待排课程列表
	 * @return returnMap
	 */
	@RequestMapping("getTaskByCulturePlan")
	@ResponseBody
	public Object getTaskByCulturePlan(@RequestParam String culturePlanInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		List<Edu201> taskInfo = new ArrayList<Edu201>();
		//培养计划下所有教学班
		List<Edu301> calssInfo = administrationPageService.getCulturePlanAllTeachingClasses(levelCode, departmentCode,gradeCode, majorCode);
		// 如果层次关系下有教学班查询所有教学班待排课程
		if (calssInfo.size() > 0) {
			taskInfo= administrationPageService.getTaskByCulturePlan(levelCode, departmentCode,gradeCode, majorCode);
		}

		returnMap.put("calssInfo", calssInfo);
		returnMap.put("taskInfo", taskInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
	
	
	/**
	 *  课程性质按钮获取待排课程列表
	 * @return returnMap
	 */
	@RequestMapping("kcxzBtnGetTask")
	@ResponseBody
	public Object kcxzBtnGetTask(@RequestParam("SearchObject") String SearchObject) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchObject);
		String levelCode = searchObject.getString("level");
		String departmentCode = searchObject.getString("department");
		String gradeCode = searchObject.getString("grade");
		String majorCode = searchObject.getString("major");
		String jxbID = searchObject.getString("jxbID");
		String kcxz = searchObject.getString("kcxz");
		List<Edu201> taskInfo = new ArrayList<Edu201>();
		if(jxbID.equals("")||jxbID==null){
			taskInfo= administrationPageService.kcxzBtnGetTask(levelCode, departmentCode,gradeCode, majorCode,kcxz);
		}else{
			taskInfo= administrationPageService.kcxzBtnGetTaskWithJxb(levelCode, departmentCode,gradeCode, majorCode,kcxz,jxbID);
		}
		returnMap.put("taskInfo", taskInfo);
		returnMap.put("result", true);
		return returnMap;
	}
	
//	/**
//	 *  排课页面开始检索按钮
//	 * @return returnMap
//	 */
//	@RequestMapping("startSearchSchedule")
//	@ResponseBody
//	public Object startSearchSchedule(@RequestParam("SearchObject") String SearchObject) {
//		Map<String, Object> returnMap = new HashMap();
//		List<Edu201> taskInfo = administrationPageService.startSearchSchedule(SearchObject);
//		returnMap.put("taskInfo", taskInfo);
//		returnMap.put("result", true);
//		return returnMap;
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
