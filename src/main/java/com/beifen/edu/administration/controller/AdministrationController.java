package com.beifen.edu.administration.controller;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;

import com.beifen.edu.administration.PO.StudentBreakPO;
import com.beifen.edu.administration.PO.TeachingSchedulePO;
import com.beifen.edu.administration.PO.TeachingTaskPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.*;
import org.apache.commons.fileupload.*;
import org.apache.commons.fileupload.servlet.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.util.WebUtils;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.utility.ReflectUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/*
 * 业务处理Controller测试
 * */
@Controller
public class AdministrationController {

	ReflectUtils utils = new ReflectUtils();
	@Autowired
	private AdministrationPageService administrationPageService;
	@Autowired
	private StudentManageService studentManageService;
	@Autowired
	private TeachingPointService teachingPointService;
	@Autowired
	private StaffManageService staffManageService;

	/**
	 * 新增修改课程
	 * @param addinfo
	 * @param approvalobect
	 * @return
	 */
	@RequestMapping("addNewClass")
	@ResponseBody
	public ResultVO addNewClass(@RequestParam("newClassInfo") String addinfo, @RequestParam("approvalobect") String approvalobect,@RequestParam("userKey") String userKey) {
		JSONObject jsonObject = JSONObject.fromObject(addinfo);
		JSONObject jsonObject2 = JSONObject.fromObject(approvalobect);
		Edu200 addClassInfo = (Edu200) JSONObject.toBean(jsonObject, Edu200.class);
		Edu600 edu600 = (Edu600) JSONObject.toBean(jsonObject2, Edu600.class);
		ResultVO result = administrationPageService.addNewClass(edu600,addClassInfo,userKey);
		return result;
	}

	/**
	 * 课程库停用课程
	 * @param choosedCrouse
	 * @return
	 */
	@RequestMapping("stopClass")
	@ResponseBody
	public ResultVO stopClass(@RequestParam("choosedCrouse") String choosedCrouse,@RequestParam("approvalobect") String approvalobect) {
		List<String> stopList = JSON.parseArray(choosedCrouse, String.class);
		Edu600 edu600 = JSON.parseObject(approvalobect, Edu600.class);
		ResultVO resultVO = administrationPageService.stopClass(stopList,edu600);
		return resultVO;
	}

	/**
	 * 课程库搜索课程
	 * @param SearchCriteria
	 * @return
	 */
	@RequestMapping("librarySeacchClass")
	@ResponseBody
	public ResultVO librarySeacchClass(@RequestParam("SearchCriteria") String SearchCriteria,@RequestParam("userId") String userId) {
		com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(SearchCriteria);
		Edu200 edu200 = JSON.toJavaObject(jsonObject, Edu200.class);
		ResultVO result = administrationPageService.librarySeacchClass(edu200,userId);
		return result;
	}

	/**
	 * 课程是否有存在培养计划
	 * @param deleteIds
	 * @return
	 */
	@RequestMapping("checkCrouseIsInPlan")
	@ResponseBody
	public Object checkCrouseIsInPlan(@RequestParam String deleteIds) {
		Map<String, Object> returnMap = new HashMap();
		List<String> classArray = JSON.parseArray(deleteIds, String.class);
		boolean isInPlan;
		// 查询课程是否存在培养计划
		for (int i = 0; i < classArray.size(); i++) {
			isInPlan = administrationPageService.classIsInCurturePlan(classArray.get(i));
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
	 * @param deleteIds
	 * @return
	 */
	@RequestMapping("libraryReomveClassByID")
	@ResponseBody
	public ResultVO libraryReomveClassByID(@RequestParam String deleteIds) {
		List<String> removeIdList = JSON.parseArray(deleteIds, String.class);
		ResultVO resultVO = administrationPageService.libraryReomveClassByID(removeIdList);
		return resultVO;
	}

	/**
	 * 导入课程
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("importNewClass")
	@ResponseBody
	public ResultVO importNewClass(HttpServletRequest request) {
		MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
		ResultVO resultVO = administrationPageService.importNewClass(multipartRequest);
		return resultVO;
	}

	/**
	 * 下载课程更新模板
	 *
	 * @return returnMap
	 * @throws ParseException
	 * @throws Exception
	 */
	@RequestMapping("downloadModifyClassesModal")
	@ResponseBody
	public ResultVO downloadModifyClassesModal(HttpServletRequest request,HttpServletResponse response,@RequestParam(value = "modifyClassesIDs") String modifyClassesIDs) throws IOException, ParseException {
		// 根据ID查询已选学生信息
		com.alibaba.fastjson.JSONArray modifyTeacherArray = JSON.parseArray(modifyClassesIDs);
		List<Edu200> chosedClasses=new ArrayList<Edu200>();
		for (int i = 0; i < modifyTeacherArray.size(); i++) {
			Edu200 edu200=administrationPageService.queryClassById(modifyTeacherArray.get(i).toString());
			chosedClasses.add(edu200);
		}
		boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
		String fileName="";
		if(isIE){
			fileName="modifyClasses";
		}else{
			fileName="批量更新课程模板";
		}
		//创建Excel文件
		XSSFWorkbook workbook  = new XSSFWorkbook();
		utils.createModifyClassesModal(workbook,chosedClasses);
		utils.loadModal(response,fileName, workbook);
		ResultVO result = ResultVO.setSuccess("下载成功");
		return result;
	}


	/**
	 * 检验修改课程的文件
	 *
	 *
	 * @return returnMap
	 * @throws ParseException
	 * @throws Exception
	 * @throws ServletException
	 */
	@RequestMapping("verifiyModifyClassesFile")
	@ResponseBody
	public Object verifiyModifyClassesFile(@RequestParam("file") MultipartFile file) throws ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		Map<String, Object> checkRS = utils.checkNewClassFile(file, "ModifyEdu200", "已选课程信息");
		checkRS.put("result", true);
		return checkRS;
	}


	/**
	 * 批量修改课程
	 * @param request
	 * @return
	 * @throws Exception
	 */
	@RequestMapping("modifyClassess")
	@ResponseBody
	public ResultVO modifyClassess(HttpServletRequest request) throws Exception {
		MultipartHttpServletRequest multipartRequest = WebUtils.getNativeRequest(request, MultipartHttpServletRequest.class);
		ResultVO result = administrationPageService.modifyClassess(multipartRequest);
		return result;
	}


	/**
	 * 获得教学相关公共代码信息
	 */
	@RequestMapping("/getJxPublicCodes")
	@ResponseBody
	public ResultVO getJxPublicCodes() {
		ResultVO resultVO = administrationPageService.getJxPublicCodes();
		return resultVO;
	}

	/**
	 * 新增修改学年
	 */
	@RequestMapping("/addNewXn")
	@ResponseBody
	public ResultVO addNewXn(@RequestParam String xninfo) {
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(xninfo);
		Edu400 edu400 = (Edu400) JSONObject.toBean(jsonObject, Edu400.class);
		ResultVO result = administrationPageService.addNewXn(edu400);
		return result;
	}


	/**
	 *预备开始排课时 处理相关信息
	 */
	@RequestMapping("/dealScheduleClassInfo")
	@ResponseBody
	public Object getScheduleClassMustInfo(@RequestParam String edu103Id) {
		Map<String, Object> returnMap = new HashMap();

		//获取学年
		returnMap.put("termInfo", administrationPageService.queryAllXn());
		//获取课节
		returnMap.put("kjInfo", administrationPageService.queryAllDeafultKj());
		returnMap.put("jxdInfo", teachingPointService.querySiteBySsxqCode());

		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 根据学年获取学年信息
	 * @param termId
	 * @return
	 */
	@RequestMapping("/getTermInfoById")
	@ResponseBody
	public Object getTermInfoById(@RequestParam String termId) {
		Map<String, Object> returnMap = new HashMap();
		//获取学年
		returnMap.put("termInfo", administrationPageService.getTermInfoById(termId));
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 获得所有学年
	 * @return
	 */
	@RequestMapping("/getAllXn")
	@ResponseBody
	public Object getAllXn() {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("termInfo", administrationPageService.queryAllXn());
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 获得教务相关公共代码信息
	 * @return
	 */
	@RequestMapping("/getJwPublicCodes")
	@ResponseBody
	public Object getJwPublicCodes(@RequestParam("userId") String userId) {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("allLevel", administrationPageService.queryAllLevel());
		returnMap.put("allDepartment", administrationPageService.queryAllDepartmentByUser(userId));
		returnMap.put("allGrade", administrationPageService.queryAllGrade());
		returnMap.put("allMajor", administrationPageService.queryAllMajor());
		returnMap.put("allTeacher", staffManageService.queryAllTeacher());
		returnMap.put("allTerm", administrationPageService.queryAllXn());
		returnMap.put("AllLocal", administrationPageService.queryAllLocal());
		returnMap.put("result", true);
		return returnMap;
	}


	/**
	 * 获得所有层次关系管理信息
	 */
	@RequestMapping("/getAllRelationInfo")
	@ResponseBody
	public ResultVO getAllRelationInfo(@RequestParam("userId") String userId) {
		ResultVO result = administrationPageService.queryAllRelation(userId);
		return result;
	}

	/**
	 * 新增修改层次关系
	 * @param newRelationInfo
	 * @return
	 */
	@RequestMapping("addNewRelation")
	@ResponseBody
	public ResultVO addNewRelation(@RequestParam("newRelationInfo") String newRelationInfo) {
		// 将收到的jsonObject转为javabean 关系管理实体类
		JSONObject jsonObject = JSONObject.fromObject(newRelationInfo);
		Edu107 edu107 = (Edu107) JSONObject.toBean(jsonObject, Edu107.class);
		ResultVO result = administrationPageService.addNewRelation(edu107);
		return result;
	}

	/**
	 * 删除层次关系
	 * @param deleteIds
	 * @return
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
	public ResultVO seacchRelation(@RequestParam String SearchCriteria,@RequestParam("userId") String userId) {
		JSONObject jsonObject = JSONObject.fromObject(SearchCriteria);
		Edu107 edu107 = new Edu107();
		edu107.setEdu103mc(jsonObject.getString("lvelName"));
		edu107.setEdu104mc(jsonObject.getString("deaparmentName"));
		edu107.setEdu105mc(jsonObject.getString("gradeName"));
		edu107.setEdu106mc(jsonObject.getString("majorName"));
		ResultVO result = administrationPageService.seacchRelation(edu107,userId);
		return result;
	}

	/**
	 * 新增层次
	 * @param newLevelInfo
	 * @return
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
	 * @param updateinfo
	 * @return
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
	 * @param deleteIds
	 * @return
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
	 * @param newDeaparment
	 * @return
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
	 * @param updateinfo
	 * @return
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
	 * @param deleteIds
	 * @return
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
	 * @param newGrade
	 * @return
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
	 * @param updateinfo
	 * @return
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
	 * @param deleteIds
	 * @return
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
	 * 根据二级学院查询专业
	 * @param departmentCode
	 * @return
	 */
	@RequestMapping("searchMajorByDepartment")
	@ResponseBody
	public ResultVO stopClass(@RequestParam("departmentCode") String departmentCode) {
		ResultVO resultVO = administrationPageService.searchMajorByDepartment(departmentCode);
		return resultVO;
	}

	/**
	 * 新增专业
	 * @param newMajor
	 * @return
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
	 * @param updateinfo
	 * @return
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
	 * @param deleteIds
	 * @return
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
	public ResultVO levelMatchDepartment(@RequestParam("leveCode") String leveCode,@RequestParam("userId") String userId) {
		ResultVO resultVO =  administrationPageService.levelMatchDepartment(leveCode, userId);
		return resultVO;
	}

	/**
	 * 获得某层次下的系部
	 */
	@RequestMapping("/alllevelMatchDepartment")
	@ResponseBody
	public ResultVO alllevelMatchDepartment(@RequestParam("leveCode") String leveCode) {
		ResultVO resultVO =  administrationPageService.alllevelMatchDepartment(leveCode);
		return resultVO;
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
	public Object gradeMatchMajor(@RequestParam("gradeCode") String gradeCode,@RequestParam("departmentCode") String departmentCode) {
		Map<String, Object> returnMap = new HashMap();
		returnMap.put("major", administrationPageService.gradeMatchMajor(gradeCode,departmentCode));
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 添加专业课程是查询(通过审核)课程
	 */
	@RequestMapping("/queryAllPassCrouse")
	@ResponseBody
	public ResultVO queryCrouseBelongToCultureplan(@RequestParam("userId") String userId) {
		ResultVO result = administrationPageService.queryAllPassCrouse(userId);
		return result;
	}

	/**
	 * 查询培养计划下的专业课程
	 */
	@RequestMapping("/queryCulturePlanCouses")
	@ResponseBody
	public ResultVO queryCulturePlanCouses(@RequestParam("edu107Id") String edu107Id) {
		ResultVO result = administrationPageService.findPlanCourse(edu107Id);
		return result;
	}

	/**
	 * 培养计划新增专业课程
	 */
	@RequestMapping("/culturePlanAddCrouse")
	@ResponseBody
	public ResultVO culturePlanAddCrouse(@RequestParam("edu107Id") String edu107Id,
									   @RequestParam("crouseInfo") String crouseInfo) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject crouse = JSONObject.fromObject(crouseInfo);
		Edu108 edu108 = (Edu108) JSONObject.toBean(crouse, Edu108.class);
		ResultVO result = administrationPageService.culturePlanAddCrouse(edu107Id,edu108);
		return result;
	}

	/**
	 * 修改培养计划下的专业课程
	 * @param edu107Id
	 * @param modifyInfo
	 * @param approvalObject
	 * @return
	 */
	@RequestMapping("modifyCultureCrose")
	@ResponseBody
	public ResultVO  modifyCultureCrose(@RequestParam("edu107Id") String edu107Id,
									 @RequestParam("modifyInfo") String modifyInfo ,
									 @RequestParam("approvalInfo") String approvalObject) {
		JSONObject approvalInfo = JSONObject.fromObject(approvalObject);
		Edu600 edu600 = (Edu600) JSONObject.toBean(approvalInfo, Edu600.class);
		// 将修改信息转化为108实体
		JSONObject newCrouseInfo = JSONObject.fromObject(modifyInfo);
		Edu108 edu108 = (Edu108) JSONObject.toBean(newCrouseInfo, Edu108.class);
		ResultVO result = administrationPageService.modifyCultureCrose(edu107Id,edu108,edu600);
		return result;
	}

	/**
	 * 删除培养计划下的专业课程
	 * @param deleteIds
	 * @return
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
	public Object addCrouseSeacch(@RequestParam("SearchCriteria") String SearchCriteria,@RequestParam("userId")String userId) {
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		// 填充搜索对象
		Edu200 edu200 = new Edu200();
		edu200.setKcdm(searchObject.getString("coursesCode"));
		edu200.setKcmc(searchObject.getString("coursesName"));
		edu200.setBzzymc(searchObject.getString("majorWorkSign"));
		edu200.setDepartmentCode(searchObject.getString("departmentCode"));


		ResultVO result = administrationPageService.addCrouseSeacch(edu200,userId);
		return result;
	}

	/**
	 * 搜索培养计划下的专业课程
	 * @param searchCriteria
	 * @return
	 */
	@RequestMapping("culturePlanSeacchCrouse")
	@ResponseBody
	public ResultVO culturePlanSeacchCrouse(@RequestParam String searchCriteria) {
		JSONObject searchObject = JSONObject.fromObject(searchCriteria);
		// 填充搜索对象
		Edu108 edu108 = new Edu108();
		String edu107_ID=searchObject.getString("edu107_ID");
		edu108.setEdu107_ID(Long.parseLong(edu107_ID));
		edu108.setKcxzCode(searchObject.getString("coursesNature"));
		edu108.setKcmc(searchObject.getString("coursesName"));
		edu108.setKsfsCode(searchObject.getString("testWay"));
		ResultVO result = administrationPageService.culturePlanSeacchCrouse(edu108);
		return result;
	}

	/**
	 * 培养计划审核
	 * @param modifyInfo
	 * @return
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
	 * @param id
	 * @param feedBack
	 * @return
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
	 * @param addInfo
	 * @return
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
			String yxbz = "1"; // 有效标志
			String configTheCulturePlan = "F";// 初始化的是否生成开课计划
			String xz =administrationPageService.queryXzByPyccbm(edu300.getPyccbm()); // 学制
			String currntNum=edu300.getZdybjxh(); //当前要是用的数字尾缀
			String  njbm=administrationPageService.query105BYID(edu300.getNjbm()).getNjbm();
			String  xbbm=administrationPageService.query104BYID(edu300.getXbbm()).getXbbm();
			String  zybm=administrationPageService.query106BYID(edu300.getZybm()).getZybm();
			if(Integer.parseInt(edu300.getZdybjxh())<=9){
				currntNum =String.valueOf("0"+currntNum);
			}else{
				currntNum =String.valueOf(currntNum);
			}

			//班号  年级编码+（自定义序号）
			String bh =njbm+currntNum;

			//班级代码
			String bjdm =xz+currntNum;

			//班级编码
			String bjbm =njbm+xbbm+zybm+bjdm;

			String xqmc =administrationPageService.queryXqByPyccbm(1,edu300.getPyccbm()); // 校区名称
			String xqbm = administrationPageService.queryXqByPyccbm(2,edu300.getPyccbm()); // 校区编码

			edu300.setYxbz(yxbz);
			edu300.setSfsckkjh(configTheCulturePlan);
//			edu300.setXqmc(xqmc);
//			edu300.setXqbm(xqbm);
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
	 * @param culturePlanInfo
	 * @param modifyInfo
	 * @return
	 */
	@RequestMapping("modifyAdministrationClass")
	@ResponseBody
	public Object modifyAdministrationClass(@RequestParam("culturePlanInfo") String culturePlanInfo,
											@RequestParam("modifyInfo") String modifyInfo) {
		Map<String, Object> returnMap = new HashMap();

		// 将修改信息转化为108实体
		JSONObject newCrouseInfo = JSONObject.fromObject(modifyInfo);
		Edu300 edu300 = (Edu300) JSONObject.toBean(newCrouseInfo, Edu300.class);
		Boolean namehave= administrationPageService.checkClassRepeat(edu300.getEdu300_ID(),edu300.getXzbmc());
		// 不存在则修改
		if (!namehave) {
			administrationPageService.updateAdministrationClass(edu300);
		}

		returnMap.put("namehave", namehave);
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

		List<Edu300> currentAllAdministrationClasses = administrationPageService.queryCulturePlanAdministrationClasses(levelCode, departmentCode, gradeCode, majorCode);
		returnMap.put("classesInfo", currentAllAdministrationClasses);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 删除培养计划下的行政班
	 * @param deleteIds
	 * @return
	 */
	@RequestMapping("removeAdministrationClass")
	@ResponseBody
	public Object deleteAdministrationClass(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		List<Edu001> allStudent = studentManageService.queryAllStudent();

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
	 * 查询全部行政班
	 * @return
	 */
	@RequestMapping("findAllClass")
	@ResponseBody
	public Object findAllClass(@RequestParam("userId") String userId) {
		Map<String, Object> returnMap = new HashMap();
		List<Edu300> classList = administrationPageService.findAllClass(userId);
		returnMap.put("classList",classList);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 查询同专业行政班
	 * @return
	 */
	@RequestMapping("findClassByMajor")
	@ResponseBody
	public Object findClassByMajor(@RequestParam("edu301_ID") String edu301_ID) {
		Map<String, Object> returnMap = new HashMap();
		List<Edu300> classList = administrationPageService.findClassByMajor(edu301_ID);
		returnMap.put("classList",classList);
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
	public ResultVO searchAdministrationClass(@RequestParam String SearchCriteria,@RequestParam("userId") String userId) {
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
		ResultVO result = administrationPageService.searchAdministrationClass(edu300,userId);
		return result;
	}

	/**
	 * 生成开课计划查询课程库和班级信息
	 * @param edu107_Id
	 * @return
	 */
	@RequestMapping("/getGeneratCoursePalnInfo")
	@ResponseBody
	public ResultVO getGeneratCoursePalnInfo(@RequestParam("culturePlanInfo") String edu107_Id) {
		ResultVO result = administrationPageService.getGeneratCoursePalnInfo(edu107_Id);
		return result;
	}

	/**
	 * 确认生成开课计划
	 */
	@RequestMapping("/generatCoursePlan")
	@ResponseBody
	public ResultVO generatCoursePlan(@RequestParam("generatInfo") String generatInfo) {
		JSONObject culturePlan = JSONObject.fromObject(generatInfo);
		ResultVO  result = administrationPageService.generatCoursePlan(culturePlan);
		return result;
	}

	/**
	 * 生成专业下所有课程开课计划
	 */
	@RequestMapping("/generatAllClassAllCourse")
	@ResponseBody
	public ResultVO generatAllClassAllCourse(@RequestParam("edu107") String edu107_Id) {
		ResultVO result = administrationPageService.generatAllClassAllCourse(edu107_Id);
		return result;
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
	 * 教学班管理 -确认班级操作
	 * @param classInfo
	 * @return
	 */
	@RequestMapping("confirmClassAction")
	@ResponseBody
	public ResultVO confirmClassAction(@RequestParam("classInfo") String classInfo) {
		List<Edu301> edu301List = JSON.parseArray(classInfo, Edu301.class);
		ResultVO result = administrationPageService.classAction(edu301List);
		return  result;
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
			studentInfos = studentManageService.queryAllStudent();
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
	 * @param culturePlanInfo
	 * @return
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
	 * @return
	 */
	@RequestMapping("getAllTeachingClasses2")
	@ResponseBody
	public ResultVO getAllTeachingClasses2(@RequestParam("userId") String userId) {
		ResultVO result = administrationPageService.getAllTeachingClasses(userId);
		return result;
	}

	/**
	 * 删除教学班
	 * @param deleteIds
	 * @return
	 */
	@RequestMapping("removeTeachingClass")
	@ResponseBody
	public Object removeTeachingClass(@RequestParam String deleteIds) {
		com.alibaba.fastjson.JSONArray deleteArray = JSON.parseArray(deleteIds);
		for (int i = 0; i < deleteArray.size(); i++) {
			administrationPageService.removeTeachingClassByID(deleteArray.get(i).toString());
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

		// 填充搜索对象
		Edu301 edu301 = new Edu301();
		edu301.setJxbmc(className);
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
				administrationClassesWithcrouseInfo.put("zymc", allAdministrationClasses.get(i).getZymc());
				administrationClassesWithcrouseInfo.put("zybm", allAdministrationClasses.get(i).getZybm());
				administrationClassesWithcrouseInfo.put("xzbmc", allAdministrationClasses.get(i).getXzbmc());
				administrationClassesWithcrouseInfo.put("xzbbm", allAdministrationClasses.get(i).getXzbbm());
				administrationClassesWithcrouseInfo.put("kcmc", palnInfos.get(p).getKcmc());
				administrationClassesWithcrouseInfo.put("ksdm", palnInfos.get(p).getKcdm());
				administrationClassesWithcrouseInfo.put("kcxz", palnInfos.get(p).getKcxz());
				administrationClassesWithcrouseInfo.put("kcxzCode", palnInfos.get(p).getKcxzCode());
				administrationClassesWithcrouseInfo.put("xf", palnInfos.get(p).getXf());
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
	 * @param culturePlanInfo
	 * @return
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



//	/**
//	 * 删除通知
//	 * @return returnMap
//	 */
//	@RequestMapping("removeNotices")
//	@ResponseBody
//	public Object removeNotices(@RequestParam("removeInfo") String removeInfo) {
//		Map<String, Object> returnMap = new HashMap();
//		JSONArray deleteArray = JSONArray.fromObject(removeInfo); // 解析json字符
//		String imgRootPath = new File(this.getClass().getResource("/").getPath()).toString()+"/static/";
//
//		for (int i = 0; i < deleteArray.size(); i++) {
//			Edu993 currentNoteInfo=administrationPageService.getNoteInfoById(deleteArray.get(i).toString());
//			String noticeBody=currentNoteInfo.getTzzt();
//			List<String> imgSrcs=utils.getImgSrc(noticeBody);
//			for (int img = 0; img < imgSrcs.size(); img++) {
//				//只删除插入的图片 不删除表情
//				if(imgSrcs.get(img).startsWith("image")){
//					File file = new File(imgRootPath+imgSrcs.get(img));
//					if (file.exists()) {
//						if (file.delete()) {
//							System.out.println("通知附带图片删除成功");
//						}
//					}
//				}
//			}
//			administrationPageService.removeNotices(deleteArray.get(i).toString());
//		}
//		returnMap.put("result", true);
//		return returnMap;
//	}


	/**
	 * 获取可供发布的教学任务书
	 * @return returnMap
	 */
	@RequestMapping("getTaskInfo")
	@ResponseBody
	public ResultVO getTaskInfo(@RequestParam("searchInfo") String searchInfo,@RequestParam("userId") String userId) {
		JSONObject searchObject = JSONObject.fromObject(searchInfo);
		String pyjhmc = searchObject.getString("pyjhmc");
		String kcmc = searchObject.getString("kcmc");
		String departmentCode = searchObject.getString("departmentCode");
		Edu206 edu206 = new Edu206();
		edu206.setPyjhmc(pyjhmc);
		edu206.setKcmc(kcmc);
		ResultVO result = administrationPageService.getTaskInfo(edu206,departmentCode,userId);
		return result;
	}


	/**
	 * 获得部门信息
	 * @return returnMap
	 */
	@RequestMapping("getPkAndKkInfo")
	@ResponseBody
	public Object getKkbmInfo() {
		Map<String, Object> returnMap = new HashMap();
		List<Edu104> kkbm = administrationPageService.queryAllKkbm();
		List<Edu104> pkbm = administrationPageService.queryAllPkbm();
		returnMap.put("kkbm", kkbm);
		returnMap.put("pkbm", pkbm);
		returnMap.put("result", true);
		return returnMap;
	}


	/**
	 * 发布教学任务书
	 * @return returnMap
	 */
	@RequestMapping("putOutTask")
	@ResponseBody
	public ResultVO putOutTask(@RequestParam("taskInfo") String taskInfo, @RequestParam("approvalInfo") String approvalInfo) {
		List<Edu201> edu201s = JSON.parseArray(taskInfo, Edu201.class);
		JSONObject apprvalObject = JSONObject.fromObject(approvalInfo); // 解析审批流json字符
		Edu600 edu600 = (Edu600) JSONObject.toBean(apprvalObject, Edu600.class);
		ResultVO result = administrationPageService.putOutTask(edu201s,edu600);
		return result;
	}



	/**
	 * 查看已发布任务书
	 * @return returnMap
	 */
	@RequestMapping("queryPutedTasks")
	@ResponseBody
	public ResultVO queryPutedTasks(@RequestParam("userId") String userId) {
		ResultVO result = administrationPageService.queryPutedTasks(userId);
		return result;
	}


	/**
	 * 删除教学任务书
	 * @return returnMap
	 */
	@RequestMapping("removeTasks")
	@ResponseBody
	public ResultVO removeTasks(@RequestParam("removeInfo") String removeInfo) {
		ResultVO result;
		List<String> deleteArray = JSON.parseArray(removeInfo, String.class);// 解析json字符
		result = administrationPageService.removeTasks(deleteArray);
		return result;
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
	 * 检索已发布的教学任务书
	 * @return returnMap
	 */
	@RequestMapping("searchPutOutTasks")
	@ResponseBody
	public Object searchPutOutTasks(@RequestParam("SearchCriteria") String SearchCriteria,@RequestParam("userId") String userId) {
		Map<String, Object> returnMap = new HashMap();
		JSONObject searchObject = JSONObject.fromObject(SearchCriteria);
		String pyjhmc = searchObject.getString("pyjhmc");
		String kcmc = searchObject.getString("kcmc");
		String sszt = searchObject.getString("sszt");
		String departmentCode = searchObject.getString("departmentCode");
		Edu201 edu201=new Edu201();
		edu201.setPyjhmc(pyjhmc);
		edu201.setKcmc(kcmc);
		edu201.setSszt(sszt);
		List<Edu201> taskInfo = administrationPageService.searchPutOutTasks(edu201,departmentCode,userId);
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
	 * 查询待排课程列表
	 * @param culturePlanInfo
	 * @param userId
	 * @return
	 */
	@RequestMapping("getTaskByCulturePlanByUser")
	@ResponseBody
	public ResultVO getTaskByCulturePlanByUser(@RequestParam("culturePlanInfo") String culturePlanInfo,@RequestParam("userId") String userId) {
		JSONObject culturePlan = JSONObject.fromObject(culturePlanInfo);
		String levelCode = culturePlan.getString("level");
		String departmentCode = culturePlan.getString("department");
		String gradeCode = culturePlan.getString("grade");
		String majorCode = culturePlan.getString("major");
		String kcxz = culturePlan.getString("kcxz");

		Edu107 edu107 = new Edu107();
		edu107.setEdu103(levelCode);
		edu107.setEdu104(departmentCode);
		edu107.setEdu105(gradeCode);
		edu107.setEdu106(majorCode);

		Edu108 edu108 = new Edu108();
		edu108.setKcxzCode(kcxz);


		ResultVO result= administrationPageService.getTaskByCulturePlanByUser(edu107,edu108,userId);
		return result;
	}

	/**
	 *  根据ID删除排课信息
	 * @return returnMap
	 */
	@RequestMapping("removeTeachingSchedule")
	@ResponseBody
	public Object removeTeachingSchedule(@RequestParam("scheduleId") String scheduleId) {
		Map<String, Object> returnMap = new HashMap();
		List<String> scheduleIds  = com.alibaba.fastjson.JSONObject.parseArray(scheduleId, String.class);
		for (String s : scheduleIds) {
			administrationPageService.removeTeachingSchedule(s);
		}
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 *  查询已排课信息
	 * @return returnMap
	 */
	@RequestMapping("searchTeachingScheduleCompleted")
	@ResponseBody
	public Object searchTeachingScheduleCompleted(@RequestParam("searchCondition") String searchCondition,@RequestParam("userId") String userId) {
		Map<String, Object> returnMap = new HashMap();
		com.alibaba.fastjson.JSONObject jsonObject = com.alibaba.fastjson.JSONObject.parseObject(searchCondition);
		TeachingSchedulePO teachingSchedule = JSON.toJavaObject(jsonObject,TeachingSchedulePO.class);
		returnMap = administrationPageService.searchTeachingScheduleCompleted(teachingSchedule,userId);
		return returnMap;
	}

	/**
	 *  查询已排课详情
	 * @return returnMap
	 */
	@RequestMapping("searchScheduleCompletedDetail")
	@ResponseBody
	public Object searchScheduleCompletedDetail(@RequestParam("Edu202Id") String Edu202Id) {
		Map<String, Object> returnMap;
		returnMap = administrationPageService.searchScheduleCompletedDetail(Edu202Id);
		return returnMap;
	}

	/**
	 * 课程表查询
	 * @param searchCondition
	 * @return
	 */
	@RequestMapping("searchSchoolTimetable")
	@ResponseBody
	public Object searchSchoolTimetable(@RequestParam("searchCondition") String searchCondition) {
		Map<String, Object> returnMap = new HashMap();
		administrationPageService.removeTeachingSchedule(searchCondition);
		returnMap.put("result", true);
		return returnMap;
	}

	/**
	 * 根据关联字段查询二级代码
	 * @param ejdmglzd
	 * @return
	 */
	@RequestMapping("/queryEdu000")
	@ResponseBody
	public List<Edu000> queryEdu000(@RequestParam String ejdmglzd) {
		List<Edu000> ejdm = administrationPageService.queryEjdm(ejdmglzd);
		return ejdm;
	}

	/**
	 * 确认排课
	 * @param edu201Id
	 * @param scheduleDetail
	 * @param scatteredClass
	 * @return
	 */
	@RequestMapping("/comfirmSchedule")
	@ResponseBody
	public Object comfirmSchedule(@RequestParam("Edu201Id") String edu201Id,@RequestParam("scheduleDetail") String scheduleDetail,@RequestParam("scatteredClass") String scatteredClass) {
		Map<String, Object> returnMap = new HashMap();
		// 将收到的jsonObject转为javabean 关系管理实体类
		List<Edu203> edu203List = JSON.parseArray(scheduleDetail, Edu203.class);
		List<Edu207> edu207List = JSON.parseArray(scatteredClass, Edu207.class);
		boolean isSuccess = administrationPageService.saveSchedule(edu201Id, edu203List, edu207List);
		if(isSuccess){
			administrationPageService.taskPutSchedule(edu201Id);
		}
		returnMap.put("result", isSuccess);
		return returnMap;
	}

	/**
	 * 查询排课所有信息
	 * @param edu202Id
	 * @return
	 */
	@RequestMapping("/searchScheduleInfo")
	@ResponseBody
	public ResultVO searchScheduleInfo(@RequestParam("edu202Id") String edu202Id) {
		ResultVO resultVO = administrationPageService.searchScheduleInfo(edu202Id);
		return resultVO;
	}


	/**
	 * 生成教学班名单
	 * @param scheduleInfo
	 * @return
	 */
	@RequestMapping("/exportRollcallExcel")
	@ResponseBody
	public ResultVO exportRollcallExcel(HttpServletRequest request,HttpServletResponse response,@RequestParam("edu301Ids") String scheduleInfo) {
		// 将收到的jsonObject转为javabean 关系管理实体类
		List<String> edu301IdList = JSON.parseArray(scheduleInfo, String.class);
		ResultVO result = administrationPageService.exportRollcallExcel(request,response,edu301IdList);
		return result;
	}


	/**
	 * 根据权限查询二级学院
	 * @param userId
	 * @return
	 */
	@RequestMapping("/getUsefulDepartment")
	@ResponseBody
	public ResultVO getUsefulDepartment(@RequestParam("userId") String userId) {
		ResultVO result = administrationPageService.getUsefulDepartment(userId);
		return result;
	}

	/**
	 * 查询二级学院
	 * @return
	 */
	@RequestMapping("/getAllDepartment")
	@ResponseBody
	public ResultVO getAllDepartment() {
		ResultVO result = administrationPageService.getAllDepartment();
		return result;
	}

	/**
	 * 根据类型选择班级
	 * @param classType
	 * @param userId
	 * @return
	 */
	@RequestMapping("/getClassByType")
	@ResponseBody
	public ResultVO getClassBytype(@RequestParam("classType") String classType,@RequestParam("userId") String userId) {
		ResultVO result = administrationPageService.getClassBytype(classType,userId);
		return result;
	}


	/**
	 * 检查教学班是否被使用
	 * @param classIds
	 * @return
	 */
	@RequestMapping("/checkTeachingClassInTask")
	@ResponseBody
	public ResultVO checkTeachingClassInTask(@RequestParam("classIds") String classIds) {
		List<String> classIdList = JSON.parseArray(classIds, String.class);
		ResultVO result = administrationPageService.checkTeachingClassInTask(classIdList);
		return result;
	}

	/**
	 * 检查教学班是否被使用
	 * @param edu107
	 * @param approvalInfo
	 * @return
	 */
	@RequestMapping("/confirmStartPlan")
	@ResponseBody
	public ResultVO confirmStartPlan(@RequestParam("edu107") String edu107,@RequestParam("approvalInfo") String approvalInfo) {
		com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(approvalInfo);
		Edu600 edu600 = JSON.toJavaObject(jsonObject, Edu600.class);
		edu600.setBusinessKey(Long.parseLong(edu107));
		ResultVO result = administrationPageService.confirmStartPlan(edu600);
		return result;
	}

	/**
	 *违纪学生查询
	 * @param searchsObject
	 * @return
	 */
	@RequestMapping("/findBreakStudent")
	@ResponseBody
	public ResultVO findBreakStudent(@RequestParam("searchsObject") String searchsObject) {
		StudentBreakPO studentBreakPO = JSON.parseObject(searchsObject, StudentBreakPO.class);
		ResultVO result = administrationPageService.findBreakStudent(studentBreakPO);
		return result;
	}

	/**
	 *新增学生违纪
	 * @param breakInfo
	 * @return
	 */
	@RequestMapping("/addStudentBreak")
	@ResponseBody
	public ResultVO addStudentBreak(@RequestParam("breakInfo") String breakInfo) {
		Edu006 edu006 = JSON.parseObject(breakInfo, Edu006.class);
		ResultVO result = administrationPageService.addStudentBreak(edu006);
		return result;
	}

	/**
	 *根据学生查找违纪记录
	 * @param studentId
	 * @return
	 */
	@RequestMapping("/searchBreakInfoByStudent")
	@ResponseBody
	public ResultVO searchBreakInfoByStudent(@RequestParam("studentId") String studentId) {
		ResultVO result = administrationPageService.searchBreakInfoByStudent(studentId);
		return result;
	}


	/**
	 *撤销违纪记录
	 * @param cancelId
	 * @return
	 */
	@RequestMapping("/cancelBreakInfo")
	@ResponseBody
	public ResultVO cancelBreakInfo(@RequestParam("cancelId") String cancelId,@RequestParam("studentId") String studentId) {
		ResultVO result = administrationPageService.cancelBreakInfo(cancelId,studentId);
		return result;
	}


	/**
	 *查询班级是否排课
	 * @param classIds
	 * @return
	 */
	@RequestMapping("/checkClassUsed")
	@ResponseBody
	public ResultVO checkClassUsed(@RequestParam("classIds") String classIds) {
		List<String> classIdList = JSON.parseArray(classIds, String.class);
		ResultVO result = administrationPageService.checkClassUsed(classIdList);
		return result;
	}

	/**
	 * 查询行政班
	 * @param searchInfo
	 * @return
	 */
	@RequestMapping("/taskSearchAdministrativeClass")
	@ResponseBody
	public ResultVO taskSearchAdministrativeClass(@RequestParam("searchInfo") String searchInfo) {
		Edu300 edu300 = JSON.parseObject(searchInfo, Edu300.class);
		ResultVO result = administrationPageService.taskSearchAdministrativeClass(edu300);
		return result;
	}

	/**
	 * 查询行政班
	 * @param teachingClassName
	 * @return
	 */
	@RequestMapping("/taskSearchTeachingClass")
	@ResponseBody
	public ResultVO taskSearchTeachingClass(@RequestParam("teachingClassName") String teachingClassName) {
		ResultVO result = administrationPageService.taskSearchTeachingClass(teachingClassName);
		return result;
	}
}
