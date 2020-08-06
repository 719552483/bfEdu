package com.beifen.edu.administration.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.beifen.edu.administration.utility.ReflectUtils;

import net.sf.json.JSONObject;

@Configuration
@Service
public class AdministrationPageService {
	ReflectUtils utils = new ReflectUtils();

	@Autowired
	private Edu001Dao edu001DAO;
	@Autowired
	private Edu000Dao edu000DAO;
	@Autowired
	private Edu990Dao edu990DAO;
	@Autowired
	private Edu991Dao edu991DAO;
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
	private Edu500Dao edu500DAO;

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
				AdministrationPageService.this.addStudent(edu001);
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
				AdministrationPageService.this.addStudent(edu001);
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
	public void classAction(List<Edu301> newTeachingClasses) {
		List<Edu301> allTeachingClasses = edu301DAO.findAll();
		boolean dateBaseHaveJXB = false;// 数据库是否有教学班
		if (allTeachingClasses.size() != 0) {
			dateBaseHaveJXB = true;
		}

		// 判断新教学班是否有包含学生字段 有则按学生id更新学生教学班信息 无则按行政班id更新学生信息
		for (int n = 0; n < newTeachingClasses.size(); n++) {
			edu301DAO.save(newTeachingClasses.get(n));
			Edu301 deu301 = new Edu301();
			deu301.setEdu301_ID(newTeachingClasses.get(n).getEdu301_ID());
			deu301.setJxbmc(newTeachingClasses.get(n).getJxbmc());

			String bhXSid = newTeachingClasses.get(n).getBhxsCode();
			if (bhXSid != null && !bhXSid.equals("")) {
				String[] bhXsid = newTeachingClasses.get(n).getBhxsCode().split(",");
				for (int BHXS = 0; BHXS < bhXsid.length; BHXS++) {
					edu001DAO.stuffStudentTeachingClassInfoby001id(deu301.getJxbmc(), deu301.getEdu301_ID(),
							bhXsid[BHXS]);
				}
			} else {
				String[] bhXZBid = newTeachingClasses.get(n).getBhxzbid().split(",");
				for (int BHXZB = 0; BHXZB < bhXZBid.length; BHXZB++) {
					edu001DAO.stuffStudentTeachingClassInfoBy300id(deu301.getJxbmc(), deu301.getEdu301_ID(),
							bhXZBid[BHXZB]);
				}
			}
		}

		// 数据库是否有教学班 并且数据库中教学班的108id等于西教学班的108id 则删除原始教学班
		if (dateBaseHaveJXB) {
			for (int a = 0; a < allTeachingClasses.size(); a++) {
				for (int n = 0; n < newTeachingClasses.size(); n++) {
					if (allTeachingClasses.get(a).getEdu108_ID().equals(newTeachingClasses.get(n).getEdu108_ID())) {
						edu301DAO.removeTeachingClassByID(allTeachingClasses.get(a).getEdu301_ID().toString());
					}
				}
			}
		}
	}

	// 增加教学班
	public void addTeachingClass(Edu301 edu301) {
		edu301DAO.save(edu301);
	}

	// 删除教学班
	public void removeTeachingClassByID(String edu301ID) {
		edu301DAO.removeTeachingClassByID(edu301ID);
	}

	// 删除教学班同时更新学生教学班信息
	public void updateStudentTeachingClassInfo(List<Edu001> allStudent, String edu301id) {
		for (int i = 0; i < allStudent.size(); i++) {
			if (allStudent.get(i).getEdu301_ID() != null) {
				if (allStudent.get(i).getEdu301_ID().equals(edu301id)) {
					Edu001 edu001 = allStudent.get(i);
					edu001.setEdu001_ID(allStudent.get(i).getEdu001_ID());
					edu001.setJxbname(null);
					edu001.setEdu301_ID(null);
					edu001DAO.save(edu001);
				}
			}
		}
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

	// 查询所有学生信息
	public List<Edu001> queryAllStudent() {
		return edu001DAO.findAll();
	}

	// 根据id查询学生信息
	public Edu001 queryStudentBy001ID(String edu001Id) {
		return edu001DAO.queryStudentBy001ID(edu001Id);
	}

	// 查询学生所在行政班ID
	public String queryStudentXzbCode(String edu001Id) {
		return edu001DAO.queryStudentXzbCode(edu001Id);
	}

	// 查询学生身份证号是否存在
	public boolean IDcardIshave(String sfzh) {
		boolean isHave = false;
		if (sfzh != null) {
			List<Edu001> IDcards = edu001DAO.IDcardIshave(sfzh);
			if (IDcards.size() > 0)
				isHave = true;
		}
		return isHave;
	}

	// 为新生生成学号
	public String getNewStudentXh(String edu300_ID) {
		String newXh = "";
		String xzbBm = edu300DAO.queryXzbByEdu300ID(edu300_ID).get(0).getXzbbm();
		List<Edu001> thisClassAllStudents = edu001DAO.queryStudentInfoByAdministrationClass(edu300_ID);
		if (thisClassAllStudents.size() != 0) {
			List<Long> currentXhs = new ArrayList<Long>();
			for (int i = 0; i < thisClassAllStudents.size(); i++) {
				currentXhs.add(Long.parseLong(thisClassAllStudents.get(i).getXh()));
			}
			int newXhSuffix = 0;
			String maxXh = String.valueOf(Collections.max(currentXhs));
			maxXh = maxXh.replace(xzbBm, "");
			newXhSuffix = Integer.parseInt(maxXh) + 1;
			if (newXhSuffix <= 9) {
				newXh = String.valueOf(xzbBm + "00" + newXhSuffix);
			} else if (newXhSuffix > 9 && newXhSuffix <= 99) {
				newXh = String.valueOf(xzbBm + "0" + newXhSuffix);
			} else {
				newXh = String.valueOf(xzbBm + newXhSuffix);
			}
		} else {
			newXh = xzbBm + "001";
		}
		return newXh;
	}
	
	// 为教师生成学号
	public String getNewTeacherJzgh() {
		String jzgh_before =utils.getRandom(2);
		String newXh = "";
		List<Edu101> allTeacher = edu101DAO.findAll();
		if (allTeacher.size() != 0) {
			List<Long> currentjzghs = new ArrayList<Long>();
			for (int i = 0; i < allTeacher.size(); i++) {
				currentjzghs.add(Long.parseLong(allTeacher.get(i).getJzgh().substring(2, allTeacher.get(i).getJzgh().length())));
			}
			int newXhSuffix = 0;
			String maxjzgh = String.valueOf(Collections.max(currentjzghs));
			newXhSuffix = Integer.parseInt(maxjzgh) + 1;
			if (newXhSuffix <= 9) {
				newXh = jzgh_before + "00" +  newXhSuffix;
			} else if (newXhSuffix > 9 && newXhSuffix <= 99) {
				newXh = jzgh_before + "0" +  newXhSuffix;
			} else {
				newXh = jzgh_before + newXhSuffix;
			}
		} else {
			newXh = jzgh_before + "001";
		}
		return newXh;
	}
	
	//根据id查学生学号
	public String queryXhBy001ID(String edu001_ID) {
		return edu001DAO.queryXhBy001ID(edu001_ID);
	}

	// 批量发放毕业证
	public void graduationStudents(String edu001Id) {
		edu001DAO.graduationStudents(edu001Id);
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

	// 新增学生
	public void addStudent(Edu001 edu001) {
		edu001DAO.save(edu001);
	}

	// 新增学生时改变相关信息
	public void addStudentUpdateCorrelationInfo(List<Edu301> teachingClassesBy300id, String edu300Id) {
		// 改变行政班人数
		AdministrationPageService.this.addAdministrationClassesZXRS(edu300Id);

		// 行政班如果生成了教学班并且是以教学班划分
		if (teachingClassesBy300id.size() != 0 && teachingClassesBy300id.size() != 0) {
			for (int i = 0; i < teachingClassesBy300id.size(); i++) {
				AdministrationPageService.this
						.addTeachingClassesJXBRS(teachingClassesBy300id.get(i).getEdu301_ID().toString());
				edu001DAO.stuffStudentTeachingClassInfoBy300id(teachingClassesBy300id.get(i).getJxbmc(),
						teachingClassesBy300id.get(i).getEdu301_ID(), edu300Id);
			}
		}

		// 行政班如果生成了教学班并且是以学生划分的话 则该学生只有行政班信息没有教学班信息
	}

	// 删除学生
	public void removeStudentByID(long studentId) {
		edu001DAO.removeStudentByID(studentId);
	}

	// 删除学生时改变相关信息
	public void removeStudentUpdateCorrelationInfo(List<Edu301> teachingClassesBy300id,
			List<Edu301> teachingClassesBy001id, String edu300_ID, long studentId) {
		// 改变行政班人数
		AdministrationPageService.this.cutAdministrationClassesZXRS(edu300_ID);

		// 学生有教学班
		// 1.教学班以行政班划分
		if (teachingClassesBy300id.size() != 0) {
			for (int i = 0; i < teachingClassesBy300id.size(); i++) {
				AdministrationPageService.this
						.cutTeachingClassesJXBRS(teachingClassesBy300id.get(i).getEdu301_ID().toString());
			}
		} else if (teachingClassesBy001id.size() != 0) {
			// 2.教学班以学生划分
			for (int i = 0; i < teachingClassesBy001id.size(); i++) {
				List<String> oldBbhxsList = Arrays.asList(teachingClassesBy001id.get(i).getBhxsCode().split(","));
				// 教学班人数减一
				for (int o = 0; o < oldBbhxsList.size(); o++) {
					if (oldBbhxsList.get(o).equals(String.valueOf(studentId))) {
						AdministrationPageService.this
								.cutTeachingClassesJXBRS(teachingClassesBy001id.get(i).getEdu301_ID().toString());
					}
				}

				String newBbhxsId = "";
				for (int o2 = 0; o2 < oldBbhxsList.size(); o2++) {
					// 如果教学班包含学生id中有删除学生的id 则删除
					if (!oldBbhxsList.get(o2).equals(String.valueOf(studentId))) {
						newBbhxsId += oldBbhxsList.get(o2) + ",";
					}
				}
				edu301DAO.updateJXBbhxsInfo(newBbhxsId, teachingClassesBy001id.get(i).getEdu301_ID()); // 更新教学班包含学生字段
			}
		}
	}

	// 修改学生时修改了行政班的情况
	public void updateStudent(Edu001 newStudentInfo) {
		// 新行政班人数加一
		AdministrationPageService.this.addAdministrationClassesZXRS(newStudentInfo.getEdu300_ID());

		// 新行政班有无教学班
		List<Edu301> newXZBofJXB = edu301DAO.queryTeachingClassByXzbCode(newStudentInfo.getEdu300_ID());
		if (newXZBofJXB.size() != 0) {
			// 新行政班有教学班并且是以行政班划分 则该教学班人数加一并更新学生教学班相关信息
			for (int i = 0; i < newXZBofJXB.size(); i++) {
				AdministrationPageService.this.addTeachingClassesJXBRS(newXZBofJXB.get(i).getEdu301_ID().toString());
				newStudentInfo.setEdu301_ID(newXZBofJXB.get(i).getEdu301_ID().toString());
				newStudentInfo.setJxbname(newXZBofJXB.get(i).getJxbmc());
			}

			// 新行政班有教学班并且是以学生划分 则不处理
		}

		// 旧行政班未被删除则旧行政班人数减一
		String oldXZB = queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
		if (oldXZB != null) {
			String oldXZBId = edu001DAO.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
			AdministrationPageService.this.cutAdministrationClassesZXRS(oldXZBId);
		}

		// 旧行政班有无教学班
		String oldXZBofThisStuden = edu001DAO.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
		List<Edu301> oldXZBofJXB = edu301DAO.queryTeachingClassByXzbCode(oldXZBofThisStuden);

		if (oldXZBofJXB.size() != 0) {
			// 旧行政班有教学班并且是以行政班划分 则该教学班人数减一
			for (int i = 0; i < oldXZBofJXB.size(); i++) {
				AdministrationPageService.this.cutTeachingClassesJXBRS(oldXZBofJXB.get(i).getEdu301_ID().toString());
			}

			// 旧行政班有教学班并且是以学生划分 则不处理
		}
		// 修改学生
		edu001DAO.save(newStudentInfo);
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

	// 增加教学班人数
	public void addTeachingClassesJXBRS(String jxbcode) {
		int oldJXBrs = edu301DAO.queryJXBrs(jxbcode);
		int newJXBrs = oldJXBrs + 1;
		edu301DAO.changeTeachingClassesRS(jxbcode, newJXBrs);
	}

	// 减少教学班人数
	public void cutTeachingClassesJXBRS(String jxbcode) {
		int oldJXBrs = edu301DAO.queryJXBrs(jxbcode);
		int newJXBrs = oldJXBrs - 1;
		edu301DAO.changeTeachingClassesRS(jxbcode, newJXBrs);
	}

	// 新增学生是否会超过行政班容纳人数
	public boolean administrationClassesIsSpill(String edu300_ID) {
		boolean studentSpill = false;
		int nrrs = edu300DAO.queryXZBrnrs(edu300_ID);
		int counts = edu001DAO.countXzbRS(edu300_ID);

		if ((counts + 1) > nrrs && nrrs != 0) {
			studentSpill = true;
		}
		return studentSpill;
	}

	// 检查有没有系统用户
	public boolean checkHaveSysUser() {
		Edu990 edu990 = edu990DAO.checkHaveSysUser("sys");
		if (edu990 == null) {
			return false;
		} else {
			return true;
		}
	}

	// 查询所有用户
	public List<Edu990> queryAllUser() {
		return edu990DAO.findAll();
	}

	// 根据用户id查询用户信息
	public Edu990 queryUserById(String userId) {
		return edu990DAO.queryUserById(userId);
	}

	// 新建或修改用户
	public void newUser(Edu990 edu990) {
		edu990DAO.save(edu990);
	}

	// 删除用户
	public void removeUser(String bf990_ID) {
		edu990DAO.removeUser(bf990_ID);
	}

	// 查询用户是否存在
	public Edu990 checkIsHaveUser(String userName) {
		return edu990DAO.checkIsHaveUser(userName);
	}

	// 查询密码是否正确
	public String checkPwd(String username) {
		return edu990DAO.checkPwd(username);
	}

	// 获取用户信息
	public Edu990 getUserInfo(String username) {

		return edu990DAO.getUserInfo(username);
	}

	// 修改首页快捷方式
	public void newShortcut(String userId, String newShortcut) {
		edu990DAO.newShortcut(userId, newShortcut);
	}

	// 修改角色时更新用户角色信息
	public void updateUserJs(Edu991 edu991) {
		List<Edu990> userThisJsUsers = AdministrationPageService.this
				.useThisRoleEdu990s(edu991.getBF991_ID().toString());
		for (int i = 0; i < userThisJsUsers.size(); i++) {
			Edu990 edu990 = userThisJsUsers.get(i);
			edu990.setJs(edu991.getJs());
			edu990DAO.save(edu990);
		}
	}

	// 删除角色时查看角色当前是否有人使用
	public List<Edu990> useThisRoleEdu990s(String edu991_id) {
		String js = edu991DAO.queryNAMEBy991id(edu991_id);
		return edu990DAO.useThisRoleEdu990s(js);
	}

	// 根据角色获取权限信息
	public Edu991 getAuthoritysInfo(String js) {
		return edu991DAO.getAuthoritysInfo(js);
	}

	// 新增角色
	public void addRole(Edu991 newRole) {
		edu991DAO.save(newRole);
	}

	// 删除角色
	public void removeRole(String bf991_ID) {
		edu991DAO.removeRole(bf991_ID);
	}

	// 获取所有角色
	public List<Edu991> getAllRole() {
		return edu991DAO.findAll();
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

	// 获取二级代码
	public List<Edu000> queryEjdm() {

		return edu000DAO.queryejdm();

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

	//新增教师
	public void addTeacher(Edu101 edu101) {
		edu101DAO.save(edu101);
	}
	
	// 根据id查询教师姓名
	public String queryTecaherNameById(Long techerId) {
		return edu101DAO.queryTeacherById(techerId);
	}
	
	// 根据id查询教师所有信息
	public Edu101 queryTeacherBy101ID(String techerId) {
		return edu101DAO.queryTeacherBy101ID(techerId);
	}
	
	// 根据id查询教职工号
	public String queryJzghBy101ID(String techerId) {
		return edu101DAO.queryJzghBy101ID(techerId);
	}
	
	// 查询所有教师
	public List<Edu101> queryAllTeacher() {
		return edu101DAO.findAll();
	}
	
	//查询教师任务书
	public boolean checkTeacherTasks(String edu101Id) {
		boolean canRemove=true;
		List<Edu201> teacherTasks =edu201DAO.queryTaskByTeacherID(edu101Id);
		List<Edu201> mainTeacherTasks =edu201DAO.queryMainTaskByTeacherID(edu101Id);
		if(teacherTasks.size()>0||mainTeacherTasks.size()>0){
			canRemove=false;
		}
		return canRemove;
	}
	
	//删除教师
	public void removeTeacher(String edu101Id) {
		edu101DAO.removeTeacher(edu101Id);
	}

	//查询教师身份证号是否已存在
	public boolean teacherIDcardIshave(String sfzh) {
		boolean isHave = false;
		if (sfzh != null) {
			List<Edu101> IDcards = edu101DAO.teacherIDcardIshave(sfzh);
			if (IDcards.size() > 0)
				isHave = true;
		}
		return isHave;
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
	public void putOutTask(Edu201 edu201) {
		edu201DAO.save(edu201);
	}

	// 发布教学任务书时更改108的信息
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
				retrunList.add(edu201);
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

	// 新增学年
	public void addNewXn(Edu400 edu400) {
		edu400DAO.save(edu400);
	}

	// 查询默认课节设置
	public List<Edu401> queryDefaultkjsz() {
		return edu401DAO.queryDefaultkjsz();
	}

	// 查询所有课节 包含指定了学年的
	public List<Edu401> queryAllKj() {
		return edu401DAO.findAll();
	}

	// 新增课节
	public void addNewKj(Edu401 edu401) {
		edu401DAO.save(edu401);
	}

	// 新增课节时获得课节顺序
	public String getNewKjsh(Edu401 edu401) {
		List<Edu401> currentKjLenth = null;
		// 课节是否指定了学年
		if (edu401.getXnid() != null) {
			currentKjLenth = edu401DAO.findKjPonitXnAndSjd(edu401.getXnid().toString(), edu401.getSjd());
		} else {
			currentKjLenth = edu401DAO.findKjPonitSjd(edu401.getSjd());
		}

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
		if (remove401.getXnid() != null) {
			allEdu401 = edu401DAO.findKjPonitXnAndSjd(remove401.getXnid().toString(), sjd);
		} else {
			allEdu401 = edu401DAO.queryDefaultkjsz();
		}

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
				if (edu200.getKcxz() != null && !"".equals(edu200.getKcxz())) {
					predicates.add(cb.like(root.<String> get("kcxz"), '%' + edu200.getKcxz() + '%'));
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

	// 学生管理搜索学生
	public List<Edu001> studentMangerSearchStudent(Edu001 edu001) {
		Specification<Edu001> specification = new Specification<Edu001>() {
			public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
					predicates.add(cb.equal(root.<String> get("pycc"), edu001.getPycc()));
				}
				if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
					predicates.add(cb.equal(root.<String> get("szxb"), edu001.getSzxb()));
				}
				if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
					predicates.add(cb.equal(root.<String> get("nj"), edu001.getNj()));
				}
				if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
					predicates.add(cb.equal(root.<String> get("zybm"), edu001.getZybm()));
				}
				if (edu001.getEdu300_ID() != null && !"".equals(edu001.getEdu300_ID())) {
					predicates.add(cb.equal(root.<String> get("Edu300_ID"), edu001.getEdu300_ID()));
				}
				if (edu001.getZtCode() != null && !"".equals(edu001.getZtCode())) {
					predicates.add(cb.equal(root.<String> get("ztCode"), edu001.getZtCode()));
				}
				if (edu001.getXjh() != null && !"".equals(edu001.getXjh())) {
					predicates.add(cb.like(root.<String> get("xjh"), '%' + edu001.getXjh() + '%'));
				}
				if (edu001.getXh() != null && !"".equals(edu001.getXh())) {
					predicates.add(cb.like(root.<String> get("xh"), '%' + edu001.getXh() + '%'));
				}
				if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
					predicates.add(cb.like(root.<String> get("xm"), '%' + edu001.getXm() + '%'));
				}
				if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
					predicates.add(cb.like(root.<String> get("xzbname"), '%' + edu001.getXzbname() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu001> classesEntities = edu001DAO.findAll(specification);
		return classesEntities;
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

	/**
	 * 检查同校区是否有重复教学点
	 * @param ssxq
	 * @param jxdmc
	 * @return
	 */
    public Edu500 getSchoolInfo(String ssxq, String jxdmc) {
		Edu500 site = edu500DAO.checkPointInSchool(ssxq,jxdmc);
		return site;
    }

	/**
	 *新增教学点
	 * @param newSite
	 */
	public void addSite(Edu500 newSite) {
    	edu500DAO.save(newSite);
	}

	/**
	 * 查询所有教学点
	 * @return
	 */
	public List<Edu500> queryAllSite() {
		List<Edu500> sitelist = edu500DAO.findAll();
		return  sitelist;
	}


	/**
	 * 按条件检索教学点
	 * @param edu500
	 * @return
	 */
	public List<Edu500> searchSite(Edu500 edu500) {
		Specification<Edu500> specification = new Specification<Edu500>() {
			public Predicate toPredicate(Root<Edu500> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu500.getJxdmc() != null && !"".equals(edu500.getJxdmc())) {
					predicates.add(cb.like(root.<String> get("jxdmc"),'%' + edu500.getJxdmc() + '%'));
				}
				if (edu500.getSsxq() != null && !"".equals(edu500.getSsxq())) {
					predicates.add(cb.equal(root.<String> get("ssxq"),edu500.getSsxq()));
				}
				if (edu500.getPkzyx() != null && !"".equals(edu500.getPkzyx())) {
					predicates.add(cb.equal(root.<String> get("pkzyx"),edu500.getPkzyx()));
				}
				if (edu500.getCdlx() != null && !"".equals(edu500.getCdlx())) {
					predicates.add(cb.equal(root.<String> get("cdlx"),edu500.getCdlx()));
				}
				if (edu500.getCdxz() != null && !"".equals(edu500.getCdxz())) {
					predicates.add(cb.equal(root.<String> get("cdxz"),edu500.getCdxz()));
				}
				if (edu500.getLc() != null && !"".equals(edu500.getLc())) {
					predicates.add(cb.equal(root.<String> get("lc"),edu500.getLc()));
				}
				if (edu500.getLf() != null && !"".equals(edu500.getLf())) {
					predicates.add(cb.equal(root.<String> get("lf"),edu500.getLf()));
				}

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu500> teacherEntities = edu500DAO.findAll(specification);
		return teacherEntities;
	}

	//查询教学点是否被占用
	public boolean checkIsUsed(String edu500Id) {
		boolean canRemove=true;
		List<Edu500> siteList =edu500DAO.checkIsUsed(edu500Id);
		if(siteList.size()>0){
			canRemove=false;
		}
		return canRemove;
	}

	//删除教学点
	public void removeSite(String edu500Id) {
		edu500DAO.removeSite(edu500Id);
	}
}
