package com.beifen.edu.administration.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.beifen.edu.administration.dao.Edu000Dao;
import com.beifen.edu.administration.dao.Edu001Dao;
import com.beifen.edu.administration.dao.Edu101Dao;
import com.beifen.edu.administration.dao.Edu103Dao;
import com.beifen.edu.administration.dao.Edu104Dao;
import com.beifen.edu.administration.dao.Edu105Dao;
import com.beifen.edu.administration.dao.Edu106Dao;
import com.beifen.edu.administration.dao.Edu107Dao;
import com.beifen.edu.administration.dao.Edu108Dao;
import com.beifen.edu.administration.dao.Edu200Dao;
import com.beifen.edu.administration.dao.Edu300Dao;
import com.beifen.edu.administration.dao.Edu301Dao;
import com.beifen.edu.administration.dao.Edu990Dao;
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

@Configuration
@Service
public class AdministrationPageService {

	@Autowired
	private Edu001Dao edu001DAO;
	@Autowired
	private Edu000Dao edu000DAO;
	@Autowired
	private Edu990Dao edu990DAO;
	@Autowired
	private Edu200Dao edu200DAO;
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

	// 查询所有层次
	public List<Edu103> queryAllLevel() {
		return edu103DAO.queryAllLevel();
	}
	
	//按层次编码查询层次
	public List<Edu103> queryAllLevelByPcccbm(String pcccbm) {
		return edu103DAO.queryAllLevelByPcccbm(pcccbm);
	}

	// 查询所有系部
	public List<Edu104> queryAllDepartment() {
		return edu104DAO.queryAllDepartment();
	}

	//按系部编码查询系部
	public List<Edu104> queryAllDepartmentByXbbm(String xbbm) {
		return edu104DAO.queryAllDepartmentByXbbm(xbbm);
	}
	
	// 查询所有年级
	public List<Edu105> queryAllGrade() {
		return edu105DAO.queryAllGrade();
	}
	
	//按年级编码查年级
	public List<Edu105> queryAllGradeByNjbm(String njbm) {
		return edu105DAO.queryAllGradeByNjbm(njbm);
	}

	// 查询所有专业
	public List<Edu106> queryAllMajor() {
		return edu106DAO.queryAllMajor();
	}
	
	//按专业编码查专业
	public List<Edu106> queryAllMajorByZybm(String zybm) {
		return edu106DAO.queryAllMajorByZybm(zybm);
	}

	// 查询所有层次关系管理信息
	public List<Edu107> queryAllRelation() {
		return edu107DAO.queryAllRelation();
	}
	
	// 根据层次 系部 年级 专业定位培养计划  (excel导入时可能不对应  所以要返回结果集 而不是基础数据类型)
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

	// 删除层次关系
	public void removeRelation(String edu107ID) {
		edu107DAO.removeRelation(edu107ID);
	}

	// 新增层次
	public void addNewLevel(Edu103 edu103) {
		edu103DAO.save(edu103);
	}

	// 修改层次
	public void updateLevel(Edu103 edu103) {
		edu103DAO.save(edu103);
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
	
	//根据300id查询行政班
	public List<Edu300> queryXzbByEdu300ID(String edu300_ID) {
		return edu300DAO.queryXzbByEdu300ID(edu300_ID);
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
	public List<Edu108> queryAdministrationClassesCrouse(String xzbCode) {
		return edu108DAO.queryAdministrationClassesCrouse(xzbCode);
	}
	
	//教学班拆班 合班 生成的相关操作
	public void classAction(List<Edu301> newTeachingClasses) {
		List<Edu301> allTeachingClasses = edu301DAO.findAll();
		boolean dateBaseHaveJXB=false;//数据库是否有教学班
		if(allTeachingClasses.size()!=0){
			dateBaseHaveJXB=true;
		}
		
		//判断新教学班是否有包含学生字段  有则按学生id更新学生教学班信息 无则按行政班id更新学生信息
		for(int n = 0; n < newTeachingClasses.size(); n++) {
			edu301DAO.save(newTeachingClasses.get(n));
			Edu301 deu301=new Edu301();
			deu301.setEdu301_ID(newTeachingClasses.get(n).getEdu301_ID());
			deu301.setJxbmc(newTeachingClasses.get(n).getJxbmc());
			
			String bhXSid=newTeachingClasses.get(n).getBhxsCode();
			if(bhXSid!=null&&!bhXSid.equals("")){
				String[] bhXsid=newTeachingClasses.get(n).getBhxsCode().split(",");
				for(int BHXS= 0; BHXS < bhXsid.length; BHXS++) {
					edu001DAO.stuffStudentTeachingClassInfoby001id(deu301.getJxbmc(),deu301.getEdu301_ID(), bhXsid[BHXS]);
				}
			}else{
				String[] bhXZBid=newTeachingClasses.get(n).getBhxzbid().split(",");
				for(int BHXZB= 0; BHXZB < bhXZBid.length; BHXZB++) {
					edu001DAO.stuffStudentTeachingClassInfoBy300id(deu301.getJxbmc(),deu301.getEdu301_ID(), bhXZBid[BHXZB]);
				}
			}
		}
		
		//数据库是否有教学班  并且数据库中教学班的108id等于西教学班的108id 则删除原始教学班
		if(dateBaseHaveJXB){
			for(int a = 0; a < allTeachingClasses.size(); a++) {
				for(int n = 0; n < newTeachingClasses.size(); n++) {
					if(allTeachingClasses.get(a).getEdu108_ID().equals(newTeachingClasses.get(n).getEdu108_ID())){
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
	public void updateStudentTeachingClassInfo(List<Edu001> allStudent,String edu301id) {
			for (int i = 0; i < allStudent.size(); i++) {
				if(allStudent.get(i).getEdu301_ID()!=null){
					if(allStudent.get(i).getEdu301_ID().equals(edu301id)){
						Edu001 edu001=allStudent.get(i);
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
//	public void stuffStudentTeachingClassInfoBy300id(String jxbname, Long edu301_ID, String xzbcode) {
//		edu001DAO.stuffStudentTeachingClassInfoBy300id(jxbname, edu301_ID, xzbcode);
//	}

	// 根据行政班查询学生信息
	public List<Edu001> queryStudentInfoByAdministrationClass(String xzbCode) {
		return edu001DAO.queryStudentInfoByAdministrationClass(xzbCode);
	}

	// 查询所有学生信息
	public List<Edu001> queryAllStudent() {
		return edu001DAO.findAll();
	}

	// 查询学生所在行政班ID
	public String queryStudentXzbCode(String edu001Id) {
		return edu001DAO.queryStudentXzbCode(edu001Id);
	}
	
	//查询身份证号是否存在
	public boolean IDcardIshave(String sfzh) {
		boolean isHave=false;
		if(sfzh!=null){
			List<Edu001> IDcards =edu001DAO.IDcardIshave(sfzh);
			if(IDcards.size()>0) isHave=true;
		}
		return isHave;
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
	
	//根据行政班查询教学班信息
	public List<Edu301> queryTeachingClassByXzbCode(String edu300Id){
		return edu301DAO.queryTeachingClassByXzbCode(edu300Id);
	}
	
	//根据学生查询教学班信息
	public List<Edu301> queryTeachingClassByXSCode(String edu001Id){
		return edu301DAO.queryTeachingClassByXSCode(edu001Id);
	}
	
	// 新增学生
	public void addStudent(Edu001 edu001) {
		edu001DAO.save(edu001);
	}

	// 新增学生时改变相关信息
	public void addStudentUpdateCorrelationInfo(List<Edu301> teachingClassesBy300id,String edu300Id) {
		//改变行政班人数
		AdministrationPageService.this.addAdministrationClassesZXRS(edu300Id);
		
		//行政班如果生成了教学班并且是以教学班划分
		if(teachingClassesBy300id.size()!=0&&teachingClassesBy300id.size()!=0){
			for (int i = 0; i < teachingClassesBy300id.size(); i++) {
				AdministrationPageService.this.addTeachingClassesJXBRS(teachingClassesBy300id.get(i).getEdu301_ID().toString());
				edu001DAO.stuffStudentTeachingClassInfoBy300id(teachingClassesBy300id.get(i).getJxbmc(),teachingClassesBy300id.get(i).getEdu301_ID(), edu300Id);
			}
		}
		
		//行政班如果生成了教学班并且是以学生划分的话 则该学生只有行政班信息没有教学班信息
	}
	
	// 删除学生
	public void removeStudentByID(long studentId) {
		edu001DAO.removeStudentByID(studentId);
	}
	
	// 删除学生时改变相关信息
	public void removeStudentUpdateCorrelationInfo(List<Edu301> teachingClassesBy300id,List<Edu301> teachingClassesBy001id,String edu300_ID,long studentId) {
		//改变行政班人数
		AdministrationPageService.this.cutAdministrationClassesZXRS(edu300_ID);
		
		//学生有教学班
		//1.教学班以行政班划分
		if(teachingClassesBy300id.size()!=0){
			for (int i = 0; i < teachingClassesBy300id.size(); i++) {
				AdministrationPageService.this.cutTeachingClassesJXBRS(teachingClassesBy300id.get(i).getEdu301_ID().toString());
			}
		}else if(teachingClassesBy001id.size()!=0){
		 //2.教学班以学生划分	
			for (int i = 0; i < teachingClassesBy001id.size(); i++) {
				List<String> oldBbhxsList= Arrays.asList(teachingClassesBy001id.get(i).getBhxsCode().split(","));
				//教学班人数减一
				for (int o = 0; o < oldBbhxsList.size(); o++) {
					if(oldBbhxsList.get(o).equals(String.valueOf(studentId))){
						AdministrationPageService.this.cutTeachingClassesJXBRS(teachingClassesBy001id.get(i).getEdu301_ID().toString());
					}
				}
				
				String newBbhxsId="";
				for (int o2 = 0; o2 < oldBbhxsList.size(); o2++) {
					//如果教学班包含学生id中有删除学生的id 则删除
					if(!oldBbhxsList.get(o2).equals(String.valueOf(studentId))){
						newBbhxsId+=oldBbhxsList.get(o2)+",";
					}
				}
				edu301DAO.updateJXBbhxsInfo(newBbhxsId,teachingClassesBy001id.get(i).getEdu301_ID()); //更新教学班包含学生字段
			}
		}
	}
	
    // 修改学生时修改了行政班的情况
	public void updateStudent(Edu001 newStudentInfo) {
		//新行政班人数加一
		AdministrationPageService.this.addAdministrationClassesZXRS(newStudentInfo.getEdu300_ID());
		
		//新行政班有无教学班
		List<Edu301>  newXZBofJXB= edu301DAO.queryTeachingClassByXzbCode(newStudentInfo.getEdu300_ID());
	    if(newXZBofJXB.size()!=0){
	    	// 新行政班有教学班并且是以行政班划分  则该教学班人数加一并更新学生教学班相关信息 
	    	for (int i = 0; i < newXZBofJXB.size(); i++) {
		    	AdministrationPageService.this.addTeachingClassesJXBRS(newXZBofJXB.get(i).getEdu301_ID().toString());
		    	newStudentInfo.setEdu301_ID(newXZBofJXB.get(i).getEdu301_ID().toString());
		    	newStudentInfo.setJxbname(newXZBofJXB.get(i).getJxbmc());
	    	}
	    	
	    	//新行政班有教学班并且是以学生划分  则不处理
	    }
		
	    // 旧行政班未被删除则旧行政班人数减一
	 	String oldXZB =queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
	 	if(oldXZB!=null){
	 		String  oldXZBId=edu001DAO.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
	 		AdministrationPageService.this.cutAdministrationClassesZXRS(oldXZBId);
	    }
	 	
	 	
	 	//旧行政班有无教学班
	 	String  oldXZBofThisStuden=edu001DAO.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
	 	List<Edu301>  oldXZBofJXB= edu301DAO.queryTeachingClassByXzbCode(oldXZBofThisStuden);
	 	
	    if(oldXZBofJXB.size()!=0){
	 	// 旧行政班有教学班并且是以行政班划分  则该教学班人数减一
		 	for (int i = 0; i < oldXZBofJXB.size(); i++) {
		 		AdministrationPageService.this.cutTeachingClassesJXBRS(oldXZBofJXB.get(i).getEdu301_ID().toString());
		 	}
	 		    	
	 	//旧行政班有教学班并且是以学生划分  则不处理
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


	
	
	
	
	
	

	
	
	
	
	
	// 查询用户是否存在
	public String checkIsHaveUser(String userName) {

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

	// 根据二级代码关联字段获取二级代码
	public List<Edu000> queryEjdm(String ejdmGlzd) {
		return edu000DAO.queryejdm(ejdmGlzd);
	}

	// 根据二级代码关联字段和值获取二级代码
	public List<Edu000> queryEjdmByGroupAndValue(String groupName, String value) {
		return edu000DAO.queryEjdmByGroupAndValue(groupName, value);
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

	// // 根据名称查询课程
	// public List<Edu200> queryClassByName(String calssName) {
	// return edu200DAO.queryClassByName(calssName);
	// }
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

	// 根据id查询教师姓名
	public String queryTecaherNameById(Long techerId) {
		return edu101DAO.queryTeacherById(techerId);
	}

	// 根据所有教师
	public List<Edu101> queryAllTeacher() {
		return edu101DAO.findAll();
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
				if (edu101.getSsyx() != null && !"".equals(edu101.getSsyx())) {
					predicates.add(cb.like(root.<String> get("ssyx"), '%' + edu101.getSsyx() + '%'));
				}
				if (edu101.getJsxm() != null && !"".equals(edu101.getJsxm())) {
					predicates.add(cb.like(root.<String> get("jsxm"), '%' + edu101.getJsxm() + '%'));
				}
				if (edu101.getJgh() != null && !"".equals(edu101.getJgh())) {
					predicates.add(cb.like(root.<String> get("jgh"), '%' + edu101.getJgh() + '%'));
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
				if (edu107.getPyccmc() != null && !"".equals(edu107.getPyccmc())) {
					predicates.add(cb.like(root.<String> get("pyccmc"), '%' + edu107.getPyccmc() + '%'));
				}
				if (edu107.getPyjhmc() != null && !"".equals(edu107.getPyjhmc())) {
					predicates.add(cb.like(root.<String> get("pyjhmc"), '%' + edu107.getPyjhmc() + '%'));
				}
				if (edu107.getXbmc() != null && !"".equals(edu107.getXbmc())) {
					predicates.add(cb.like(root.<String> get("xbmc"), '%' + edu107.getXbmc() + '%'));
				}
				if (edu107.getNjmc() != null && !"".equals(edu107.getNjmc())) {
					predicates.add(cb.like(root.<String> get("njmc"), '%' + edu107.getNjmc() + '%'));
				}
				if (edu107.getZymc() != null && !"".equals(edu107.getZymc())) {
					predicates.add(cb.like(root.<String> get("zymc"), '%' + edu107.getZymc() + '%'));
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
	public List<Edu301> searchTeachingClass(Edu301 edu301) {
		Specification<Edu301> specification = new Specification<Edu301>() {
			public Predicate toPredicate(Root<Edu301> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu301.getJxbmc() != null && !"".equals(edu301.getJxbmc())) {
					predicates.add(cb.like(root.<String> get("jxbmc"), '%' + edu301.getJxbmc() + '%'));
				}
				if (edu301.getKcmc() != null && !"".equals(edu301.getKcmc())) {
					predicates.add(cb.like(root.<String> get("kcmc"), '%' + edu301.getKcmc() + '%'));
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



	

	



	




	











}
