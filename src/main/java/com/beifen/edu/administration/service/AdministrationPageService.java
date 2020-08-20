package com.beifen.edu.administration.service;

import java.lang.reflect.InvocationTargetException;
import java.util.*;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.beifen.edu.administration.utility.ReflectUtils;


@Configuration
@Service
public class AdministrationPageService {
	ReflectUtils utils = new ReflectUtils();

	@Autowired
	private Edu001Dao edu001DAO;
	@Autowired
	private Edu000Dao edu000DAO;
	@Autowired
	private Edu993Dao edu993DAO;
	@Autowired
	private Edu200Dao edu200DAO;
	@Autowired
	private Edu201Dao edu201DAO;
	@Autowired
	private Edu202Dao edu202DAO;
	@Autowired
	private Edu101Dao edu101DAO;
	@Autowired
	private Edu103Dao edu103DAO;
	@Autowired
	private Edu104Dao edu104DAO;
	@Autowired
	private Edu105Dao edu105DAO;
	@Autowired
	private Edu106Dao edu106DAO;
	@Autowired
	private Edu107Dao edu107DAO;
	@Autowired
	private Edu108Dao edu108DAO;
	@Autowired
	private Edu300Dao edu300DAO;
	@Autowired
	private Edu301Dao edu301DAO;
	@Autowired
	private Edu400Dao edu400DAO;
	@Autowired
	private Edu401Dao edu401DAO;
	@Autowired
	private Edu203Dao edu203Dao;
	@Autowired
	private Edu205Dao edu205DAO;
	@Autowired
	private Edu302Dao edu302DAO;
	@Autowired
	private ScheduleCompletedViewDao scheduleCompletedViewDao;
	@Autowired
	private StudentManageService studentManageService;

	// 查询所有层次
	public List<Edu103> queryAllLevel() {
		return edu103DAO.queryAllLevel();
	}

	// 按层次编码查询层次
	public List<Edu103> queryAllLevelByPcccbm(String pcccbm) {
		return edu103DAO.queryAllLevelByPcccbm(pcccbm);
	}

	// 按名称查培养层次编码
	public String queryLevelCodeByLevelName(String pyccmc) {
		return edu103DAO.queryLevelCodeByLevelName(pyccmc);
	}

	// 根据培养层次查校区信息
	public String queryXqByPyccbm(int queryType, String pyccbm) {
		String returnStr = "";
		if (queryType == 1) {
			returnStr = edu000DAO.queryXqmcByPyccbm(edu103DAO.queryXqbmByPyccbm(pyccbm));
		} else {
			returnStr = edu103DAO.queryXqbmByPyccbm(pyccbm);
		}
		return returnStr;
	}

	// 根据培养层次查学制
	public String queryXzByPyccbm(String pyccbm) {
		return edu103DAO.queryXzByPyccbm(pyccbm);
	}

	// 查询所有系部
	public List<Edu104> queryAllDepartment() {
		return edu104DAO.queryAllDepartment();
	}

	// 按系部编码查询系部
	public List<Edu104> queryAllDepartmentByXbbm(String xbbm) {
		return edu104DAO.queryAllDepartmentByXbbm(xbbm);
	}

	// 按名称查系部编码
	public String queryXbCodeByXbName(String xbmc) {
		return edu104DAO.queryXbCodeByXbName(xbmc);
	}

	// 查询所有年级
	public List<Edu105> queryAllGrade() {
		return edu105DAO.queryAllGrade();
	}

	// 按年级编码查年级
	public List<Edu105> queryAllGradeByNjbm(String njbm) {
		return edu105DAO.queryAllGradeByNjbm(njbm);
	}

	// 按年级名称查年级编码
	public String queryNjCodeByNjName(String njmc) {
		return edu105DAO.queryNjCodeByNjName(njmc);
	}

	// 查询所有专业
	public List<Edu106> queryAllMajor() {
		return edu106DAO.queryAllMajor();
	}

	// 按专业编码查专业
	public List<Edu106> queryAllMajorByZybm(String zybm) {
		return edu106DAO.queryAllMajorByZybm(zybm);
	}

	// 按专业名称查专业编码
	public String queryZyCodeByZyName(String zymc) {
		return edu106DAO.queryZyCodeByZyName(zymc);
	}

	// 查询所有层次关系管理信息
	public List<Edu107> queryAllRelation() {
		return edu107DAO.queryAllRelation();
	}

	// 根据层次 系部 年级 专业定位培养计划 (excel导入时可能不对应 所以要返回结果集 而不是基础数据类型)
	public List<Edu107> queryPyjh(String levelCode, String departmentCode, String gradeCode, String majorCode) {
		return edu107DAO.queryPyjh(levelCode, departmentCode, gradeCode, majorCode);
	}

	// 根据层次 系部 年级 专业定位培养计划
	public long queryEdu107ID(String levelCode, String departmentCode, String gradeCode, String majorCode) {
		return edu107DAO.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);
	}

	// 新增层次关系
	public void addNewRelation(Edu107 edu107) {
		edu107DAO.save(edu107);
	}

	// 修改层次关系
	public void updateRelation(Edu107 edu107) {
		edu107DAO.save(edu107);
	}

	// 删除培养层次系部、年级、专业时验证有没有相应的培养计划，有则不允许删除
	public boolean verifyRelation(String edu107ID) {
		boolean canRemove = true;
		List<Edu108> planByEdu107 = edu108DAO.queryCulturePlanCouses(Long.valueOf(edu107ID));
		if (planByEdu107.size() > 0) {
			canRemove = false;
		}
		return canRemove;
	}

	// 删除层次关系
	public void removeRelation(String edu107ID) {
		edu107DAO.removeRelation(edu107ID);
		//
		// /*
		// * 删除层次关系下的教学班、课表、教学任务书都不应存在 学生的相应教学班删除
		// * */
		//
		//
		// List<Edu108>
		// planByEdu107=edu108DAO.queryCulturePlanCouses(Long.valueOf(edu107ID));
		// for (int p = 0; p < planByEdu107.size(); p++) {
		// Edu108 edu108=planByEdu107.get(p);
		// List<Edu301>
		// willRemove301=edu301DAO.queryTeachingClassByEdu108ID(edu108.getEdu108_ID().toString());
		// for (int w = 0; w < willRemove301.size(); w++) {
		// //删除教学班
		// edu301DAO.removeTeachingClassByID(willRemove301.get(w).getEdu301_ID().toString());
		//
		// //修改学生的教学班信息
		// List<Edu001>
		// willUpdate001=edu001DAO.queryStudentInfoBy301iD(willRemove301.get(w).getEdu301_ID().toString());
		// for (int w2 = 0; w2 < willUpdate001.size(); w2++) {
		// edu001DAO.updateStudent301InfoBy301id(null,null,willUpdate001.get(w2).getEdu301_ID());
		// }
		// }
		//
		// //删除任务书
		// Edu201
		// willRemoveTask=edu201DAO.queryTaskByedu108ID(edu108.getEdu108_ID().toString());
		// edu201DAO.removeTasks(willRemoveTask.getEdu201_ID().toString());
		//
		// //删除课表
		// // TODO Auto-generated method stub
		//
		// //删除层次和相关培养计划
		// if(edu108.getEdu107_ID().equals(Long.valueOf(edu107ID))){
		// edu107DAO.removeRelation(edu107ID);
		// edu108DAO.removePlanBy107ID(edu108.getEdu107_ID().toString());
		// }
		// }
	}

	// 新增层次
	public void addNewLevel(Edu103 edu103) {
		edu103DAO.save(edu103);
	}

	// 修改层次
	public void updateLevel(Edu103 edu103) {
		edu103DAO.save(edu103);
	}

	// 验证层次
	public Edu103 query103BYID(String edu103id) {
		return edu103DAO.query103BYID(edu103id);
	}

	// 验证层次
	public boolean verifyLevel(String edu103id) {
		boolean canRemove = true;
		Edu103 edu103 = edu103DAO.query103BYID(edu103id);
		List<Edu107> levelMatchDepartment = edu107DAO.levelMatchDepartment(edu103.getPyccbm());
		if (levelMatchDepartment.size() > 0) {
			canRemove = false;
		}
		return canRemove;
	}

	// 删除层次
	public void removeLevel(String edu103ID) {
		edu103DAO.removeLevel(edu103ID);
	}

	// 新增系部
	public void addNewDeaparment(Edu104 edu104) {
		edu104DAO.save(edu104);
	}

	// 修改系部
	public void updateDeaparment(Edu104 edu104) {
		edu104DAO.save(edu104);
	}

	// 修改系部
	public Edu104 query104BYID(String edu104id) {
		return edu104DAO.query104BYID(edu104id);
	}

	// 验证系部
	public boolean verifyDeaparment(String edu104id) {
		boolean canRemove = true;
		Edu104 edu104 = edu104DAO.query104BYID(edu104id);
		List<Edu107> levelMatchDepartment = edu107DAO.departmentMatchGrade(edu104.getXbbm());
		if (levelMatchDepartment.size() > 0) {
			canRemove = false;
		}
		return canRemove;
	}

	// 删除系部
	public void removeDeaparment(String edu104ID) {
		edu104DAO.removeDeaparment(edu104ID);
	}

	// 新增年级
	public void addNewGrade(Edu105 edu105) {
		edu105DAO.save(edu105);
	}

	// 修改年级
	public void updateGrade(Edu105 edu105) {
		edu105DAO.save(edu105);
	}

	public Edu105 query105BYID(String njbm) {
		return edu105DAO.query105BYID(njbm);
	}

	// 验证年级
	public boolean verifyGrade(String edu105id) {
		boolean canRemove = true;
		Edu105 edu105 = edu105DAO.query105BYID(edu105id);
		List<Edu107> grades = edu107DAO.gradeMatchMajor(edu105.getNjbm());
		if (grades.size() > 0) {
			canRemove = false;
		}
		return canRemove;
	}

	// 删除年级
	public void removeGrade(String edu105ID) {
		edu105DAO.removeGrade(edu105ID);
	}

	// 新增专业
	public void addNewMajor(Edu106 edu106) {
		edu106DAO.save(edu106);
	}

	// 修改专业
	public void updateMajor(Edu106 edu106) {
		edu106DAO.save(edu106);
	}

	public Edu106 query106BYID(String edu106id) {

		return edu106DAO.query106BYID(edu106id);
	}

	// 验证专业
	public boolean verifyMajor(String edu106id) {
		boolean canRemove = true;
		Edu106 edu106 = edu106DAO.query106BYID(edu106id);
		List<Edu107> grades = edu107DAO.query107ByMajorCode(edu106.getZybm());
		if (grades.size() > 0) {
			canRemove = false;
		}
		return canRemove;
	}

	// 删除专业
	public void removeMajor(String edu106ID) {
		edu106DAO.removeGrade(edu106ID);
	}

	// 查询某层次下的系部
	public List<Edu107> levelMatchDepartment(String leveCode) {
		return edu107DAO.levelMatchDepartment(leveCode);
	}

	// 查询某系部下的年级
	public List<Edu107> departmentMatchGrade(String departmentCode) {
		return edu107DAO.departmentMatchGrade(departmentCode);
	}

	// 查询某年级下的专业
	public List<Edu107> gradeMatchMajor(String gradeCode) {
		return edu107DAO.gradeMatchMajor(gradeCode);
	}

	// 查询培养计划下的专业课程
	public List<Edu108> queryCulturePlanCouses(long edu107id) {
		return edu108DAO.queryCulturePlanCouses(edu107id);
	}

	// 培养计划下新增课程
	public void culturePlanAddCrouse(Edu108 edu108) {
		edu108DAO.save(edu108);
	}

	// 修改培养计划下的专业课程
	public void updateCultureCrouse(Edu108 edu108) {
		edu108DAO.save(edu108);
	}

	// 删除培养计划下的专业课程
	public void removeCultureCrose(String edu108ID) {
		edu108DAO.removeCultureCrose(edu108ID);
	}

	// 查询更改状态的课程是否在培养计划中
	public boolean classIsInCurturePlan(String edu200id) {
		boolean notInPlan = false;
		List<Edu108> curturePlanList = edu108DAO.classIsInCurturePlan(edu200id);
		if (curturePlanList.size() != 0) {
			notInPlan = true;
		}
		return notInPlan;
	}

	// 培养计划改变状态
	public void chengeCulturePlanCrouseStatus(String id, String status) {
		edu108DAO.chengeCulturePlanCrouseStatus(id, status);
	}

	// 培养计划审核 -改变培养计划反馈意见
	public void chengeCulturePlanCrouseFeedBack(String id, String feedBack) {
		edu108DAO.chengeCulturePlanCrouseFeedBack(id, feedBack);
	}

	// 确认生成开课计划
	public void generatCoursePlan(String crouses, String classNames, String classIds, String isGeneratCoursePlan) {
		edu108DAO.chengeCulturePlanCrouseFeedBack(crouses, classNames, classIds, isGeneratCoursePlan);
	}

	// 查询所有行政班
	public List<Edu300> queryAllAdministrationClasses() {
		return edu300DAO.findAll();
	}

	// 根据300id查询行政班
	public List<Edu300> queryXzbByEdu300ID(String edu300_ID) {
		return edu300DAO.queryXzbByEdu300ID(edu300_ID);
	}

	// 根据300名称查询300id
	public Object queryEdu300IdByEdu300Name(String edu300Name) {
		return edu300DAO.queryEdu300IdByEdu300Name(edu300Name);
	}

	// 查询培养计划下的行政班
	public List<Edu300> queryCulturePlanAdministrationClasses(String levelCode, String departmentCode, String gradeCode,
															  String majorCode) {
		return edu300DAO.queryCulturePlanAdministrationClasses(levelCode, departmentCode, gradeCode, majorCode);
	}

	// 新增行政班
	public void addAdministrationClass(Edu300 edu300) {
		edu300DAO.save(edu300);
	}

	// 修改行政班
	public void updateAdministrationClass(Edu300 edu300) {
		edu300DAO.save(edu300);
		edu001DAO.updateStudentAdministrationInfo(edu300.getEdu300_ID().toString(), edu300.getXzbmc());
	}

	// 删除行政班时修改行政班下的学生行政班信息
	public void removeXZBAndUpdateStudentCorrelationInfo(List<Edu001> allstudent, Edu300 edu300) {
		for (int i = 0; i < allstudent.size(); i++) {
			if (allstudent.get(i).getEdu300_ID().equals(edu300.getEdu300_ID().toString())) {
				Edu001 edu001 = allstudent.get(i);
				edu001.setXzbname(edu300.getXzbmc());
				studentManageService.addStudent(edu001);
			}
		}
	}

	// 删除行政班
	public void removeAdministrationClass(String edu108ID) {
		edu300DAO.removeAdministrationClass(edu108ID);
	}

	// 删除行政班时更新学生行政班信息
	public void removeXZBAndUpdateStudentCorrelationInfo(List<Edu001> allstudent, String edu300Id) {
		for (int i = 0; i < allstudent.size(); i++) {
			if (allstudent.get(i).getEdu300_ID().equals(edu300Id)) {
				Edu001 edu001 = allstudent.get(i);
				edu001.setXzbname("");
				edu001.setEdu300_ID("");
				studentManageService.addStudent(edu001);
			}
		}
	}

	// 生成开课计划时修改行政班的开课计划属性
	public void generatAdministrationCoursePlan(String edu300Id, String isGeneratCoursePlan) {
		edu300DAO.generatAdministrationCoursePlan(edu300Id, isGeneratCoursePlan);
	}

	// 判断行政班是否包含在培养计划中
	public List<Edu108> queryAdministrationClassesCrouse(String Edu300_ID) {
		return edu108DAO.queryAdministrationClassesCrouse(Edu300_ID);
	}

	// 教学班拆班 合班 生成的相关操作
	public Edu301 classAction(Edu301 edu301) {
		edu301DAO.save(edu301);

		String bhzymc = "";
		String bhzyCode = "";
		Integer jxbrs = 0;

		String bhxzbid = edu301.getBhxzbid().substring(0,edu301.getBhxzbid().length() - 1);
		String bhxzbmc = edu301.getBhxzbmc().substring(0,edu301.getBhxzbmc().length() - 1);
		String[] bhxzbids= bhxzbid.split(",");
		String[] bhxzbmcs = bhxzbmc.split(",");

		edu302DAO.removeByEdu301Id(edu301.getEdu301_ID().toString());
		for (int i = 0; i < bhxzbids.length; i++) {
			Edu300 edu300 = edu300DAO.findXzbByEdu300ID(bhxzbids[i]);
			bhzymc+= edu300.getZymc()+",";
			bhzyCode+= edu300.getZybm()+",";
			jxbrs+= edu300.getZxrs();

			Edu302 save = new Edu302();
			save.setEdu301_ID(edu301.getEdu301_ID());
			save.setEdu300_ID(Long.parseLong(bhxzbids[i]));
			save.setXzbmc(bhxzbmcs[i]);
			edu302DAO.save(save);
		}

		edu301.setBhzymc(bhzymc);
		edu301.setBhzyCode(bhzyCode);
		edu301.setJxbrs(jxbrs);

		edu301DAO.save(edu301);

		return edu301;
	}

	// 增加教学班
	public void addTeachingClass(Edu301 edu301) {
		edu301DAO.save(edu301);
	}

	// 删除教学班
	public void removeTeachingClassByID(String edu301ID) {
		edu301DAO.removeTeachingClassByID(edu301ID);
		//删除教学班行政班关联
		edu302DAO.removeByEdu301Id(edu301ID);
	}



	// 查询所有教学班
	public List<Edu301> queryAllTeachingClass() {
		return edu301DAO.findAll();
	}

	// 添加教学班同时更新学生教学班信息
	// public void stuffStudentTeachingClassInfoBy300id(String jxbname, Long
	// edu301_ID, String xzbcode) {
	// edu001DAO.stuffStudentTeachingClassInfoBy300id(jxbname, edu301_ID,
	// xzbcode);
	// }

	// 根据行政班查询学生信息
	public List<Edu001> queryStudentInfoByAdministrationClass(String xzbCode) {
		return edu001DAO.queryStudentInfoByAdministrationClass(xzbCode);
	}


	// 判断导入学生的培养计划和行政班是否对应
	public boolean classMatchCultruePaln(String edu300_ID, String pycc, String szxb, String nj, String zybm) {
		boolean isMatch = true;
		List<Edu300> matchs = edu300DAO.classMatchCultruePaln(edu300_ID, pycc, szxb, nj, zybm);
		if (matchs.size() <= 0)
			isMatch = false;
		return isMatch;
	}

	// 查询培养计划下所有教学班
	public List<Edu301> getCulturePlanAllTeachingClasses(String levelCode, String departmentCode, String gradeCode,
														 String majorCode) {
		return edu301DAO.getCulturePlanAllTeachingClasses(levelCode, departmentCode, gradeCode, majorCode);
	}

	// 查询所有教学班
	public List<Edu301> getAllTeachingClasses() {
		return edu301DAO.findAll();
	}

	// 修改教学班名称
	public void modifyTeachingClassName(String teachingClassID, String newName) {
		edu301DAO.modifyTeachingClassName(teachingClassID, newName);
	}

	// 查询培养计划下所有学生
	public List<Edu001> queryCulturePlanStudent(String levelCode, String departmentCode, String gradeCode,
												String majorCode) {
		return edu001DAO.queryCulturePlanStudent(levelCode, departmentCode, gradeCode, majorCode);
	}

	// 根据行政班查询教学班信息
	public List<Edu301> queryTeachingClassByXzbCode(String edu300Id) {
		return edu301DAO.queryTeachingClassByXzbCode(edu300Id);
	}

	// 根据学生查询教学班信息
	public List<Edu301> queryTeachingClassByXSCode(String edu001Id) {
		return edu301DAO.queryTeachingClassByXSCode(edu001Id);
	}

	// 增加行政班在校人数
	public void addAdministrationClassesZXRS(String xzbcode) {
		int oldZXRS = edu300DAO.queryZXRS(xzbcode);
		int newZXRS = oldZXRS + 1;
		edu300DAO.changeAdministrationClassesZXRS(xzbcode, newZXRS);
	}

	// 减少行政班在校人数
	public void cutAdministrationClassesZXRS(String xzbCode) {
		int oldZXRS = edu300DAO.queryZXRS(xzbCode);
		int newZXRS = oldZXRS - 1;
		if (newZXRS >= 0) {
			edu300DAO.changeAdministrationClassesZXRS(xzbCode, newZXRS);
		}
	}

	// 发布通知
	public void issueNotice(Edu993 edu993) {
		edu993DAO.save(edu993);
	}

	// 根据id获取通知
	public Edu993 getNoteInfoById(String noteId) {
		return edu993DAO.getNoteInfoById(noteId);
	}

	// 改变消息是否在首页展示
	public void changeNoticeIsShowIndex(String noticeId, String isShow) {
		edu993DAO.changeNoticeIsShowIndex(noticeId, isShow);
	}

	// 获取所有通知
	public List<Edu993> getNotices() {
		return edu993DAO.findAll();
	}

	// 删除通知
	public void removeNotices(String edu990id) {
		edu993DAO.removeNotices(edu990id);
	}

	// 根据二级代码关联字段获取二级代码
	public List<Edu000> queryEjdm(String ejdmGlzd) {
		return edu000DAO.queryejdm(ejdmGlzd);
	}

	// 根据二级代码关联字段和值获取二级代码
	public List<Edu000> queryEjdmByGroupAndValue(String groupName, String value) {
		return edu000DAO.queryEjdmByGroupAndValue(groupName, value);
	}

	public String queryEjdmByEjdmZ(String ejdmz, String ejdmGlzd) {
		return edu000DAO.queryEjdmByEjdmZ(ejdmz, ejdmGlzd);
	}

	// 根据二级代码获取二级代码值
	public String queryEjdmZByEjdm(String ejdm, String ejdmmc) {
		return edu000DAO.queryEjdmZByEjdm(ejdm, ejdmmc);
	}



	// 课程库新增课程
	public void addNewClass(Edu200 edu200) {
		edu200DAO.save(edu200);
	}

	// 查询课程库所有课程
	public List<Edu200> queryAllClass() {
		return edu200DAO.findAll();
	}

	// 课程库通过审核课程
	public List<Edu200> queryAllPassCrouse() {
		return edu200DAO.queryAllPassCrouse();
	}

	// 修改课程
	public Edu200 updateClass(Edu200 du200) {
		return edu200DAO.save(du200);
	}

	// 根据Id查询课程
	public Edu200 queryClassById(String edu200id) {
		return edu200DAO.queryClassById(edu200id);
	}
	//
	// // 根据代码查询课程
	// public List<Edu200> queryClassByCode(String calssCode) {
	// return edu200DAO.queryClassByCode(calssCode);
	// }

	// 根据id修改课程状态
	public void modifyClassById(String id, String status, String approvalPerson, long approvalPersonId,
								long approvalTime) {
		edu200DAO.modifyClassById(id, status, approvalPerson, approvalPersonId, approvalTime);
	}

	// 根据id删除课程
	public void removeLibraryClass(String id) {
		edu200DAO.removeLibraryClassById(id);
	}


	// 根据教学班组装任务书信息
	public List<Object> getTaskInfo(List<Edu301> jxbInfo) {
		List<Object> sendTaskList = new ArrayList();
		List<Edu201> currentTaskList = edu201DAO.findAll();
		for (int i = 0; i < jxbInfo.size(); i++) {
			Map<String, Object> taskObject = new HashMap();
			taskObject.put("jxbInfo", jxbInfo.get(i));
			Edu108 edu108 = edu108DAO.queryPlanByEdu108ID(jxbInfo.get(i).getEdu108_ID().toString());
			taskObject.put("crouseInfo", edu108);
			sendTaskList.add(taskObject);
		}

		// 排除已发布的教学任务书(108ID和301ID都相同的)
		for (int s = 0; s < sendTaskList.size(); s++) {
			Map<String, Object> map = (HashMap) sendTaskList.get(s);
			Edu108 edu108 = (Edu108) map.get("crouseInfo");
			Edu301 edu301 = (Edu301) map.get("jxbInfo");
			for (int c = 0; c < currentTaskList.size(); c++) {
				Edu201 edu201 = currentTaskList.get(c);
				if (edu201.getEdu108_ID().equals(edu108.getEdu108_ID())
						&& edu201.getEdu301_ID().equals(edu301.getEdu301_ID())) {
					sendTaskList.remove(s);
				}
			}
		}
		return sendTaskList;
	}

	// 发布教学任务书
	public void putOutTask(TeachingTaskPO teachingTaskPO) {
		Edu201 edu201 = new Edu201();
		try {
			utils.copy(teachingTaskPO,edu201);
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}
		edu201DAO.save(edu201);
		teachingTaskPO.setEdu201_ID(edu201.getEdu201_ID());

		edu205DAO.removeByEdu201Id(edu201.getEdu201_ID().toString());
		List<TeacherPO> teacherList = JSONArray.toList((JSONArray)teachingTaskPO.getTeacherList(), new TeacherPO(), new JsonConfig());
		for(TeacherPO e : teacherList) {
			List<String> ls = e.getLs();
			List<String> lsmc = e.getLsmc();
			if("".equals(ls.get(0))){
				break;
			}
			for (int i = 0; i <ls.size(); i++) {
				Edu205 save = new Edu205();
				save.setEdu201_ID(edu201.getEdu201_ID());
				save.setTeacherType("01");
				save.setEdu101_ID(Long.parseLong(ls.get(i)));
				save.setTeacherName(lsmc.get(i));
				edu205DAO.save(save);
			}
		}

		List<TeacherPO> baseTeacherList = JSONArray.toList((JSONArray)teachingTaskPO.getBaseTeacherList(), new TeacherPO(), new JsonConfig());
		for(TeacherPO e : baseTeacherList) {
			List<String> zyls = e.getZyls();
			List<String> zylsmc = e.getZylsmc();
			if("".equals(zyls.get(0))){
				break;
			}
			for (int i = 0; i <zyls.size(); i++) {
				Edu205 save = new Edu205();
				save.setEdu201_ID(edu201.getEdu201_ID());
				save.setTeacherType("01");
				save.setEdu101_ID(Long.parseLong(zyls.get(i)));
				save.setTeacherName(zylsmc.get(i));
				edu205DAO.save(save);
			}
		}



	}

	// 发布教学任务书时更改301的信息
	public void putOutTaskAction(Long edu301_ID, Long edu201_ID) {
		Edu301 edu301 = edu301DAO.queryJXBByEdu301ID(edu301_ID.toString());
		edu301.setSffbjxrws("T");
		edu301.setEdu201_ID(edu201_ID);
		edu301DAO.save(edu301);
	}

	// 查询已发布任务书
	public List<Edu201> queryPutedTasks() {
		return edu201DAO.findAll();
	}

	// 删除教学任务书
	public void removeTasks(String edu201id) {
		//更改教学班是否发布教学任务书字段

		//删除任务书
		edu201DAO.removeTasks(edu201id);
	}

	// 根据ID查询任务书
	public Edu201 queryTaskByID(String iD) {
		return edu201DAO.queryTaskByID(iD);
	}

	// 任务书反馈意见
	public void chengeTaskFfkyj(String id, String feedBack) {
		edu201DAO.chengeTaskFfkyj(id, feedBack);
	}

	// 修改任务书状态
	public void changeTaskStatus(String id, String status) {
		edu201DAO.changeTaskStatus(id, status);
	}

	// 根据培养计划检索待排课程列表
	public List getTaskByCulturePlan(String levelCode, String departmentCode, String gradeCode, String majorCode) {
		long edu107id = edu107DAO.queryEdu107ID(levelCode, departmentCode, gradeCode, majorCode);
		List<Edu108> current108s = edu108DAO.queryCulturePlanCouses(edu107id);
		List<Edu201> retrunList = new ArrayList();
		for (int i = 0; i < current108s.size(); i++) {
			Edu201 edu201 = edu201DAO.getTaskByEdu108Id(current108s.get(i).getEdu108_ID().toString());
			if (edu201 != null) {
				if(edu201.getSfypk()==null){
					retrunList.add(edu201);
				}
			}
		}
		return retrunList;
	}

	// 课程性质按钮检索待排课程列表
	public List<Edu201> kcxzBtnGetTask(String levelCode, String departmentCode, String gradeCode, String majorCode,
									   String kcxz) {
		List<Edu201> retrunList = new ArrayList();
		List<Edu201> currentEdu201 = AdministrationPageService.this.getTaskByCulturePlan(levelCode, departmentCode,
				gradeCode, majorCode);
		for (int i = 0; i < currentEdu201.size(); i++) {
			Edu108 edu108 = edu108DAO.queryPlanByEdu108ID(currentEdu201.get(i).getEdu108_ID().toString());
			if (edu108.getKcxzCode().equals(kcxz)) {
				retrunList.add(currentEdu201.get(i));
			}
		}
		return retrunList;
	}

	// 课程性质按钮检索待排课程列表 并且有教学班
	public List<Edu201> kcxzBtnGetTaskWithJxb(String levelCode, String departmentCode, String gradeCode,
											  String majorCode, String kcxz, String jxbID) {
		List<Edu201> retrunList = new ArrayList();
		List<Edu201> currentEdu201 = AdministrationPageService.this.getTaskByCulturePlan(levelCode, departmentCode,
				gradeCode, majorCode);
		for (int i = 0; i < currentEdu201.size(); i++) {
			Edu108 edu108 = edu108DAO.queryPlanByEdu108ID(currentEdu201.get(i).getEdu108_ID().toString());
			if (edu108.getKcxzCode().equals(kcxz) && currentEdu201.get(i).getEdu301_ID().toString().equals(jxbID)) {
				retrunList.add(currentEdu201.get(i));
			}
		}
		return retrunList;
	}

	// //排课页面开始检索按钮
	// public List<Edu201> startSearchSchedule(String searchObject) {
	// JSONObject SearchObject = JSONObject.fromObject(searchObject);
	// String levelCode = SearchObject.getString("level");
	// String departmentCode = SearchObject.getString("department");
	// String gradeCode = SearchObject.getString("grade");
	// String majorCode = SearchObject.getString("major");
	// String jxbID = SearchObject.getString("jxbID");
	// String kcxz = SearchObject.getString("kcxz");
	// String kcmc = SearchObject.getString("kcmc");
	// List<Edu201> currentEdu201=
	// AdministrationPageService.this.getTaskByCulturePlan(levelCode,departmentCode,gradeCode,majorCode);
	// List<Edu201> retrunList=new ArrayList();
	// for (int i = 0; i< currentEdu201.size(); i++) {
	// Edu108
	// edu108=edu108DAO.queryPlanByEdu108ID(currentEdu201.get(i).getEdu108_ID().toString());
	// if(!jxbID.equals("")){
	//
	// }
	// }
	//
	//
	// return null;
	// }

	// 查询所有学年
	public List<Edu400> queryAllXn() {
		return edu400DAO.findAll();
	}

	// 根据ID查询学年
	public Edu400 getTermInfoById(String termId) {
		return edu400DAO.getTermInfoById(termId);
	}

	// 新增学年
	public void addNewXn(Edu400 edu400) {
		edu400DAO.save(edu400);
	}

	// 查询默认课节设置
	public List<Edu401> queryDefaultkjsz() {
		return edu401DAO.queryDefaultkjsz();
	}

	// 查询所有课节
	public List<Edu401> queryAllKj() {
		return edu401DAO.findAll();
	}

//    //根据学年获取课节信息
//	public List<Edu401> getKjInfoByXn(String termId) {
//		return edu401DAO.getKjInfoByXn(termId);
//	}

	//获取所有默认课节
	public List<Edu401>  queryAllDeafultKj() {
		return edu401DAO.queryAllDeafultKj();
	}

	// 新增课节
	public void addNewKj(Edu401 edu401) {
		edu401DAO.save(edu401);
	}

	// 新增课节时获得课节顺序
	public String getNewKjsh(Edu401 edu401) {
		List<Edu401> currentKjLenth = null;
		currentKjLenth = edu401DAO.findKjPonitSjd(edu401.getSjd());
		return String.valueOf(currentKjLenth.size() + 1);
	}

	// 验证是否有排课表正在使用该课节
	public boolean verifyKj(String kjId) {
		boolean rs = true;
		List<Edu202> useThisEdu202 = edu202DAO.verifyKj(kjId);
		if (useThisEdu202.size() > 0) {
			rs = false;
		}
		return rs;
	}

	// 删除课节
	public void removeKj(String deleteId) {
		edu401DAO.removeTasks(deleteId);
	}

	// 删除课节时将所在时段其后所有课节的顺序加一 需要考虑是否选择了学年
	public void addKjsxAterThisKj(String kjId) {
		Edu401 remove401 = edu401DAO.queryKjById(kjId);
		String sjd = remove401.getSjd();
		int kjsx = Integer.parseInt(remove401.getKjsx());
		List<Edu401> allEdu401 = null;
		allEdu401 = edu401DAO.queryDefaultkjsz();

		// 课节顺序大于删除课节的课节顺序的 可接顺序减一
		for (int i = 0; i < allEdu401.size(); i++) {
			if (Integer.parseInt(allEdu401.get(i).getKjsx()) > kjsx) {
				AdministrationPageService.this.czkjsx(allEdu401.get(i).getEdu401_ID().toString(),
						(Integer.parseInt(allEdu401.get(i).getKjsx()) - 1));
			}
		}
	}

	// 重置课节顺序
	private void czkjsx(String kjId, int kjsfAsInt) {
		String kjsx = String.valueOf(kjsfAsInt);
		edu401DAO.kjsxjy(kjId, kjsx);
	}

	// 修改课节名称
	public void modifyKjMc(String newKjMc, String kjId) {
		edu401DAO.modifyKjMc(newKjMc, kjId);
	}


	//确认排课
	public boolean saveSchedule(Edu202 edu202, List<Edu203> edu203List) {
		boolean isSuccess = true;
		//根据排课计划查找任务书
		Edu201 edu201 = edu201DAO.queryTaskByID(edu202.getEdu201_ID().toString());
		//根据任务书查找培养计划
		Edu108 edu108 = edu108DAO.queryPlanByEdu108ID(edu201.getEdu108_ID().toString());
		//总学时
		double zxs = edu108.getZxs();
		//计算排课总课时
		int ksz = Integer.parseInt(edu202.getKsz());
		int jsz = Integer.parseInt(edu202.getJsz());
		int plzks = (jsz - ksz + 1) * edu203List.size();

		if (plzks < zxs) {
			isSuccess = false;
		} else {
			edu202DAO.save(edu202);
			String edu202_id = edu202.getEdu202_ID().toString();
			//重新排列课节集合
			Collections.sort(edu203List,new Comparator<Edu203>(){
				public int compare(Edu203 arg0, Edu203 arg1) {
					// 第一次比较星期
					int i = arg0.getXqid().compareTo(arg1.getXqid());
					// 如果星期相同则进行第二次比较
					if(i==0){
						// 第二次比较课节
						int j=arg0.getKjid().compareTo(arg1.getKjid());
						return j;
					}
					return i;
				}
			});

			//按周保存排课计划
			int currentXs = 0;
			classCycle:for(int j = ksz;j < jsz + 1;j++){
				Integer saveWeek = j;
				for (Edu203 e: edu203List) {
					Edu203 save = new Edu203();
					save.setEdu202_ID(edu202_id);
					save.setWeek(saveWeek.toString());
					save.setKjid(e.getKjid());
					save.setKjmc(e.getKjmc());
					save.setXqid(e.getXqid());
					save.setXqmc(e.getXqmc());
					edu203Dao.save(save);
					currentXs++;
					if(currentXs == zxs){
						break classCycle;
					}
				}
			}
		}
		return isSuccess;
	}

	//排课后改变任务是是否已排课
	public void taskPutSchedule(String edu201ID) {
		edu201DAO.taskPutSchedule(edu201ID);
	}

	// 课程库搜索课程
	public List<Edu200> librarySeacchClass(final Edu200 edu200) {
		Specification<Edu200> specification = new Specification<Edu200>() {
			public Predicate toPredicate(Root<Edu200> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu200.getKcdm() != null && !"".equals(edu200.getKcdm())) {
					predicates.add(cb.like(root.<String> get("kcdm"), '%' + edu200.getKcdm() + '%'));
				}
				if (edu200.getKcmc() != null && !"".equals(edu200.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu200.getKcmc() + '%'));
				}
				if (edu200.getBzzymc() != null && !"".equals(edu200.getBzzymc())) {
					predicates.add(cb.like(root.<String> get("bzzymc"), '%' + edu200.getBzzymc() + '%'));
				}
				if (edu200.getKcxzCode() != null && !"".equals(edu200.getKcxzCode())) {
					predicates.add(cb.equal(root.<String> get("kcxzCode"), edu200.getKcxzCode() ));
				}
				if (edu200.getZt() != null && !"".equals(edu200.getZt())) {
					predicates.add(cb.equal(root.<String> get("zt"), edu200.getZt()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu200> courseEntities = edu200DAO.findAll(specification);
		return courseEntities;
	}

	// 搜索教师
	public List<Edu101> searchTeacher(Edu101 edu101) {
		Specification<Edu101> specification = new Specification<Edu101>() {
			public Predicate toPredicate(Root<Edu101> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu101.getSzxb() != null && !"".equals(edu101.getSzxb())) {
					predicates.add(cb.equal(root.<String> get("szxb"),edu101.getSzxb()));
				}
				if (edu101.getZy() != null && !"".equals(edu101.getZy())) {
					predicates.add(cb.equal(root.<String> get("zy"),edu101.getZy()));
				}
				if (edu101.getXm() != null && !"".equals(edu101.getXm())) {
					predicates.add(cb.like(root.<String> get("xm"), '%' + edu101.getXm() + '%'));
				}
				if (edu101.getJzgh() != null && !"".equals(edu101.getJzgh())) {
					predicates.add(cb.like(root.<String> get("jzgh"), '%' + edu101.getJzgh() + '%'));
				}
				if (edu101.getSzxbmc() != null && !"".equals(edu101.getSzxbmc())) {
					predicates.add(cb.like(root.<String> get("szxbmc"), '%' + edu101.getSzxbmc() + '%'));
				}
				if (edu101.getZc() != null && !"".equals(edu101.getZc())) {
					predicates.add(cb.equal(root.<String> get("zc"),edu101.getZc()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu101> teacherEntities = edu101DAO.findAll(specification);
		return teacherEntities;
	}

	// 搜索关系
	public List<Edu107> seacchRelation(Edu107 edu107) {
		Specification<Edu107> specification = new Specification<Edu107>() {
			public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu107.getEdu103mc() != null && !"".equals(edu107.getEdu103mc())) {
					predicates.add(cb.like(root.<String> get("edu103mc"), '%' + edu107.getEdu103mc() + '%'));
				}
				if (edu107.getPyjhmc() != null && !"".equals(edu107.getPyjhmc())) {
					predicates.add(cb.like(root.<String> get("pyjhmc"), '%' + edu107.getPyjhmc() + '%'));
				}
				if (edu107.getEdu104mc() != null && !"".equals(edu107.getEdu104mc())) {
					predicates.add(cb.like(root.<String> get("edu104mc"), '%' + edu107.getEdu104mc() + '%'));
				}
				if (edu107.getEdu105mc() != null && !"".equals(edu107.getEdu105mc())) {
					predicates.add(cb.like(root.<String> get("edu105mc"), '%' + edu107.getEdu105mc() + '%'));
				}
				if (edu107.getEdu106mc() != null && !"".equals(edu107.getEdu106mc())) {
					predicates.add(cb.like(root.<String> get("edu106mc"), '%' + edu107.getEdu106mc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu107> relationEntities = edu107DAO.findAll(specification);
		return relationEntities;
	}

	// 搜索培养计划下的专业课程
	public List<Edu108> culturePlanSeacchCrouse(Edu108 edu108) {
		Specification<Edu108> specification = new Specification<Edu108>() {
			public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu108.getEdu107_ID() != null && !"".equals(edu108.getEdu107_ID())) {
					predicates.add(cb.equal(root.<String> get("edu107_ID"), edu108.getEdu107_ID()));
				}
				if (edu108.getKcxzCode() != null && !"".equals(edu108.getKcxzCode())) {
					predicates.add(cb.equal(root.<String> get("kcxzCode"), edu108.getKcxzCode()));
				}
				if (edu108.getKcmc() != null && !"".equals(edu108.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu108.getKcmc() + '%'));
				}
				if (edu108.getKsfsCode() != null && !"".equals(edu108.getKsfsCode())) {
					predicates.add(cb.equal(root.<String> get("ksfsCode"), edu108.getKsfsCode()));
				}
				if (edu108.getXbsp() != null && !"".equals(edu108.getXbsp())) {
					predicates.add(cb.equal(root.<String> get("xbsp"), edu108.getXbsp()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu108> crouseEntities = edu108DAO.findAll(specification);
		return crouseEntities;
	}

	// 搜索行政班
	public List<Edu300> searchAdministrationClass(Edu300 edu300) {
		Specification<Edu300> specification = new Specification<Edu300>() {
			public Predicate toPredicate(Root<Edu300> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu300.getPyccbm() != null && !"".equals(edu300.getPyccbm())) {
					predicates.add(cb.equal(root.<String> get("pyccbm"), edu300.getPyccbm()));
				}
				if (edu300.getXbbm() != null && !"".equals(edu300.getXbbm())) {
					predicates.add(cb.equal(root.<String> get("xbbm"), edu300.getXbbm()));
				}
				if (edu300.getNjbm() != null && !"".equals(edu300.getNjbm())) {
					predicates.add(cb.equal(root.<String> get("njbm"), edu300.getNjbm()));
				}
				if (edu300.getZybm() != null && !"".equals(edu300.getZybm())) {
					predicates.add(cb.equal(root.<String> get("zybm"), edu300.getZybm()));
				}
				if (edu300.getXzbmc() != null && !"".equals(edu300.getXzbmc())) {
					predicates.add(cb.like(root.<String> get("xzbmc"), '%' + edu300.getXzbmc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu300> classEntities = edu300DAO.findAll(specification);
		return classEntities;
	}

	// 培养计划添加专业课程检索
	public List<Edu108> addCrouseSeacch(Edu108 edu108) {
		Specification<Edu108> specification = new Specification<Edu108>() {
			public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu108.getEdu107_ID() != null && !"".equals(edu108.getEdu107_ID())) {
					predicates.add(cb.equal(root.<String> get("edu107_ID"), edu108.getEdu107_ID()));
				}

				if (edu108.getKcdm() != null && !"".equals(edu108.getKcdm())) {
					predicates.add(cb.like(root.<String> get("kcdm"), '%' + edu108.getKcdm() + '%'));
				}
				if (edu108.getKcmc() != null && !"".equals(edu108.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu108.getKcmc() + '%'));
				}
				if (edu108.getBzzymc() != null && !"".equals(edu108.getBzzymc())) {
					predicates.add(cb.like(root.<String> get("bzzymc"), '%' + edu108.getBzzymc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu108> crouseEntities = edu108DAO.findAll(specification);
		return crouseEntities;
	}

	// 拆班搜索学生
	public List<Edu001> breakClassSearchStudent(Edu001 edu001) {
		Specification<Edu001> specification = new Specification<Edu001>() {
			public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
					predicates.add(cb.like(root.<String> get("xm"), '%' + edu001.getXm() + '%'));
				}
				if (edu001.getEdu300_ID() != null && !"".equals(edu001.getEdu300_ID())) {
					predicates.add(cb.equal(root.<String> get("edu300_ID"), edu001.getEdu300_ID()));
				}
				if (edu001.getXb() != null && !"".equals(edu001.getXb())) {
					predicates.add(cb.equal(root.<String> get("xb"), edu001.getXb()));
				}
				if (edu001.getZtCode() != null && !"".equals(edu001.getZtCode())) {
					predicates.add(cb.equal(root.<String> get("ztCode"), edu001.getZtCode()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu001> studentEntities = edu001DAO.findAll(specification);
		return studentEntities;
	}

	// 搜索教学班
	public List<Edu301> searchTeachingClass(Edu301 edu301, boolean checkSFFBRWS) {
		Specification<Edu301> specification = new Specification<Edu301>() {
			public Predicate toPredicate(Root<Edu301> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu301.getJxbmc() != null && !"".equals(edu301.getJxbmc())) {
					predicates.add(cb.like(root.<String> get("jxbmc"), '%' + edu301.getJxbmc() + '%'));
				}
				if (edu301.getKcmc() != null && !"".equals(edu301.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu301.getKcmc() + '%'));
				}
				if (edu301.getBhxzbmc() != null && !"".equals(edu301.getBhxzbmc())) {
					predicates.add(cb.like(root.<String> get("bhxzbmc"), '%' + edu301.getBhxzbmc() + '%'));
				}
				if (checkSFFBRWS) {
					predicates.add(cb.equal(root.<String> get("sffbjxrws"), "F"));
				}

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu301> teachingClassEntities = edu301DAO.findAll(specification);
		return teachingClassEntities;
	}

	// 根据行政班名称过滤行政班
	public List<Edu300> queryCulturePlanAdministrationClassesWithXZBMC(Edu300 edu300) {
		Specification<Edu300> specification = new Specification<Edu300>() {
			public Predicate toPredicate(Root<Edu300> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu300.getPyccbm() != null && !"".equals(edu300.getPyccbm())) {
					predicates.add(cb.equal(root.<String> get("pyccbm"), edu300.getPyccbm()));
				}
				if (edu300.getXbbm() != null && !"".equals(edu300.getXbbm())) {
					predicates.add(cb.equal(root.<String> get("xbbm"), edu300.getXbbm()));
				}
				if (edu300.getNjbm() != null && !"".equals(edu300.getNjbm())) {
					predicates.add(cb.equal(root.<String> get("njbm"), edu300.getNjbm()));
				}
				if (edu300.getZybm() != null && !"".equals(edu300.getZybm())) {
					predicates.add(cb.equal(root.<String> get("zybm"), edu300.getZybm()));
				}

				if (edu300.getXzbmc() != null && !"".equals(edu300.getXzbmc())) {
					predicates.add(cb.like(root.<String> get("xzbmc"), '%' + edu300.getXzbmc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu300> classesEntities = edu300DAO.findAll(specification);
		return classesEntities;
	}

	// 根据行政班编码和课程名称过滤培养计划
	public List<Edu108> queryAdministrationClassesCrouseWithKCMC(Edu108 edu108) {
		Specification<Edu108> specification = new Specification<Edu108>() {
			public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu108.getXzbmc() != null && !"".equals(edu108.getXzbmc())) {
					predicates.add(cb.like(root.<String> get("xzbmc"), '%' + edu108.getXzbmc() + '%'));
				}

				if (edu108.getKcmc() != null && !"".equals(edu108.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu108.getKcmc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu108> entities = edu108DAO.findAll(specification);
		return entities;
	}



	// 检索已发布的教学任务书
	public List<Edu201> searchPutOutTasks(Edu201 edu201) {
		Specification<Edu201> specification = new Specification<Edu201>() {
			public Predicate toPredicate(Root<Edu201> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu201.getXzbmc() != null && !"".equals(edu201.getXzbmc())) {
					predicates.add(cb.like(root.<String> get("xzbmc"), '%' + edu201.getXzbmc() + '%'));
				}

				if (edu201.getKcmc() != null && !"".equals(edu201.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu201.getKcmc() + '%'));
				}

				if (edu201.getSszt() != null && !"".equals(edu201.getSszt())) {
					predicates.add(cb.equal(root.<String> get("sszt"), edu201.getSszt()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu201> entities = edu201DAO.findAll(specification);
		return entities;
	}

	//停用课程
	public void stopClass(String Edu200id) {
		edu200DAO.updateState(Edu200id,"stop");
	}

	//查询全部行政班
	public List<Edu300> findAllClass() {
		List<Edu300> classList = edu300DAO.findAll();
		return classList;
	}


	public List<Edu300> findClassByMajor(String edu301_id) {
		List<Edu300> classList = new ArrayList<>();
		List<Edu302> edu302List = edu302DAO.findClassByEdu301ID(edu301_id);

		if(edu302List.size() != 0) {
			 Edu300 edu300  = edu300DAO.findXzbByEdu300ID(edu302List.get(0).getEdu300_ID().toString());
			 classList = edu300DAO.findClassByMajor(edu300.getZybm());
		}

		return classList;
	}

	//根据Id删除排课计划
	public void removeTeachingSchedule(String scheduleId) {
		Edu202 edu202 = edu202DAO.findEdu202ById(scheduleId);

		edu201DAO.taskPutScheduleFalse(edu202.getEdu201_ID().toString());

		edu202DAO.delete(Long.parseLong(scheduleId));

		edu203Dao.deleteByscheduleId(scheduleId);
	}

	//根据条件检索已排课信息
	public Map<String, Object> searchTeachingScheduleCompleted(TeachingSchedulePO teachingSchedule) {
		Map<String, Object> returnMap = new HashMap();

		List<TeachingSchedulePO> taskList;
		List<Edu301> teachingClassList = new ArrayList<>();

		Specification<TeachingSchedulePO> specification = new Specification<TeachingSchedulePO>() {
			public Predicate toPredicate(Root<TeachingSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<>();
				if (teachingSchedule.getPyjhcc() != null && !"".equals(teachingSchedule.getPyjhcc())) {
					predicates.add(cb.equal(root.<String> get("pyjhcc"), teachingSchedule.getPyjhcc()));
				}
				if (teachingSchedule.getPyjhxb() != null && !"".equals(teachingSchedule.getPyjhxb())) {
					predicates.add(cb.equal(root.<String> get("pyjhxb"), teachingSchedule.getPyjhxb()));
				}
				if (teachingSchedule.getPyjhnj() != null && !"".equals(teachingSchedule.getPyjhnj())) {
					predicates.add(cb.equal(root.<String> get("pyjhnj"), teachingSchedule.getPyjhnj()));
				}
				if (teachingSchedule.getPyjhzy() != null && !"".equals(teachingSchedule.getPyjhzy())) {
					predicates.add(cb.equal(root.<String> get("pyjhzy"), teachingSchedule.getPyjhzy()));
				}
				if (teachingSchedule.getJxbid() != null && !"".equals(teachingSchedule.getJxbid())) {
					predicates.add(cb.equal(root.<String> get("jxbid"), teachingSchedule.getJxbid()));
				}
				if (teachingSchedule.getKcxzid() != null && !"".equals(teachingSchedule.getKcxzid())) {
					predicates.add(cb.equal(root.<String> get("kcxzid"), teachingSchedule.getKcxzid()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		taskList = scheduleCompletedViewDao.findAll(specification);

		for (TeachingSchedulePO e : taskList) {
			Edu301 edu301 = edu301DAO.queryJXBByEdu301ID(e.getJxbid());
			teachingClassList.add(edu301);
		}

		returnMap.put("result",true);
		returnMap.put("taskList",taskList);
		returnMap.put("teachingClassList",teachingClassList);
		return returnMap;

	}

	public Map<String, Object> searchScheduleCompletedDetail(String edu202Id) {
		Map<String, Object> returnMap = new HashMap();
		ScheduleCompletedDetailPO scheduleCompletedDetails = new ScheduleCompletedDetailPO();

		Edu202 edu202 = edu202DAO.findEdu202ById(edu202Id);
		Edu201 edu201 = edu201DAO.queryTaskByID(edu202.getEdu201_ID().toString());

		try {
			utils.copyTargetSuper(edu201,scheduleCompletedDetails);
			BeanUtils.copyProperties(scheduleCompletedDetails,edu202);
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}

		scheduleCompletedDetails.setClassPeriodList(edu203Dao.getClassPeriodByEdu202Id(edu202Id,edu202.getKsz()));

		returnMap.put("result",true);
		returnMap.put("scheduleCompletedDetails",scheduleCompletedDetails);
		return returnMap;
	}

	//查询所有开课部门
	public List<Edu104> queryAllKkbm() {
		return edu104DAO.queryAllKkbm();
	}

	//查询所有排课部门
	public List<Edu104> queryAllPkbm() {
		return edu104DAO.queryAllPkbm();
	}
}
