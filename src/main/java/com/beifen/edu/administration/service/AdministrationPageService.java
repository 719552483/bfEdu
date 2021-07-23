package com.beifen.edu.administration.service;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.persistence.criteria.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Result;

import com.beifen.edu.administration.PO.*;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.NoteConstant;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.constant.SecondaryCodeConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;


@Configuration
@Service
public class AdministrationPageService {
	ReflectUtils utils = new ReflectUtils();

	@Autowired
	private Edu001Dao edu001DAO;
	@Autowired
	private Edu000Dao edu000DAO;
	@Autowired
	private Edu005Dao edu005Dao;
	@Autowired
	private Edu0051Dao edu0051Dao;
	@Autowired
	private Edu200Dao edu200DAO;
	@Autowired
	private Edu201Dao edu201DAO;
	@Autowired
	private Edu999Dao edu999DAO;
	@Autowired
	private Edu2011Dao edu2011DAO;
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
	private Edu404Dao edu404Dao;
	@Autowired
	private Edu402Dao edu402DAO;
	@Autowired
	private Edu403Dao edu403DAO;
	@Autowired
	private Edu401Dao edu401DAO;
	@Autowired
	private Edu203Dao edu203Dao;
	@Autowired
	private Edu204Dao edu204Dao;
	@Autowired
	private Edu205Dao edu205DAO;
	@Autowired
	private Edu302Dao edu302DAO;
	@Autowired
	private Edu206Dao edu206Dao;
	@Autowired
	private Edu006Dao edu006Dao;
	@Autowired
	private Edu007Dao edu007Dao;
	@Autowired
	private Edu207Dao edu207Dao;
	@Autowired
	private Edu500Dao edu500Dao;
	@Autowired
	private Edu993Dao edu993Dao;
	@Autowired
	private Edu990Dao edu990Dao;
	@Autowired
	private Edu205Dao edu205Dao;
	@Autowired
	private Edu995Dao edu995Dao;
	@Autowired
	private Edu996Dao edu996Dao;
	@Autowired
	private ScheduleCompletedViewDao scheduleCompletedViewDao;
	@Autowired
	private StudentManageService studentManageService;
	@Autowired
	private ApprovalProcessService approvalProcessService;
	@Autowired
	private StaffManageService staffManageService;
	@Autowired
	private CourseCheckOnDao courseCheckOnDao;
	@Autowired
	private RedisUtils redisUtils;
	@Autowired
	TeachingScheduleViewDao teachingScheduleViewDao;

	// 查询所有层次
	public List<Edu103> queryAllLevel() {
		return edu103DAO.queryAllLevel();
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
		return edu104DAO.findAll();
	}

	// 根据用户查询所有系部
	public List<Edu104> queryAllDepartmentByUser(String userId) {
		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
		return edu104DAO.query104BYdepartments(departments);
	}


	// 按名称查系部编码
	public String queryXbCodeByXbName(String xbmc) {
		return edu104DAO.queryXbCodeByXbName(xbmc);
	}

	// 查询所有年级
	public List<Edu105> queryAllGrade() {
		return edu105DAO.queryAllGrade();
	}


	// 按年级名称查年级编码
	public String queryNjCodeByNjName(String njmc) {
		return edu105DAO.queryNjCodeByNjName(njmc);
	}

	// 查询所有专业
	public List<Edu106> queryAllMajor() {
		return edu106DAO.queryAllMajor();
	}


	// 按专业名称查专业编码
	public String queryZyCodeByZyName(String zymc) {
		return edu106DAO.queryZyCodeByZyName(zymc);
	}

	// 查询所有层次关系管理信息
	public ResultVO queryAllRelation(String userId) {
		ResultVO resultVO;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		List<Edu107> edu107List = edu107DAO.queryAllRelation(departments);
		if(edu107List.size() == 0) {
			resultVO = ResultVO.setFailed("暂未找到培养计划");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu107List.size()+"条培养计划",edu107List);
		}
		return resultVO;
	}

	// 根据层次 系部 年级 专业定位培养计划 (excel导入时可能不对应 所以要返回结果集 而不是基础数据类型)
	public List<Edu107> queryPyjh(String levelCode, String departmentCode, String gradeCode, String majorCode) {
		List<Edu107> edu107s = edu107DAO.queryPyjh(levelCode, departmentCode, gradeCode, majorCode);
		return edu107s;
	}

	//查询是否有重复的培养计划
	public List<Edu107> checkRelation(Edu107 edu107){
		Specification<Edu107> specification = new Specification<Edu107>() {
			public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu107.getEdu107_ID() != null && !"".equals(edu107.getEdu107_ID())) {
					predicates.add(cb.notEqual(root.<String>get("edu107_ID"), edu107.getEdu107_ID()));
				}
				if (edu107.getEdu103() != null && !"".equals(edu107.getEdu103())) {
					predicates.add(cb.equal(root.<String>get("pyjhmc"), edu107.getPyjhmc()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu107> edu107List = edu107DAO.findAll(specification);
		return edu107List;
	}

	// 新增层次关系
	public ResultVO addNewRelation(Edu107 edu107) {
		ResultVO resultVO;
		List<Edu107> edu107List = checkRelation(edu107);
		if (edu107List.size() != 0) {
			resultVO = ResultVO.setFailed("培养计划名称重复，请重新输入");
			return resultVO;
		}

		edu107.setYxbz("1");
		edu107DAO.save(edu107);

		resultVO = ResultVO.setSuccess("操作成功",edu107);
		return resultVO;
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
		List<Edu107> levelMatchDepartment = edu107DAO.getDepartmentInLevel(edu103.getPyccbm());
		if (levelMatchDepartment.size() > 0) {
			canRemove = false;
		}
		return canRemove;
	}

	//查询层次下所有系部
	public List<Edu107> getDepartmentInLevel(String level) {
		List<Edu107> edu107List = edu107DAO.getDepartmentInLevel(level);
		return edu107List;

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
		List<Edu107> grades = edu107DAO.gradeMatchMajorUsed(edu105.getNjbm());
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
	public ResultVO levelMatchDepartment(String leveCode, String userId) {
		ResultVO resultVO;
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
		List<Edu104> edu104List = edu104DAO.query104BYdepartments(departments);
		if(edu104List.size() == 0) {
			resultVO = ResultVO.setFailed("暂无符合要求的二级学院信息");
		} else {
			resultVO = ResultVO.setSuccess("查询成功",edu104List);
		}
		return resultVO;
	}

	// 查询某层次下的全部系部
	public ResultVO alllevelMatchDepartment(String leveCode) {
		ResultVO resultVO;
		List<Edu104> edu104List = edu104DAO.findAll();
		if(edu104List.size() == 0) {
			resultVO = ResultVO.setFailed("暂无符合要求的二级学院信息");
		} else {
			resultVO = ResultVO.setSuccess("查询成功",edu104List);
		}
		return resultVO;
	}

	// 查询某系部下的年级
	public List<Edu105> departmentMatchGrade(String departmentCode) {
		List<Edu105> edu105List = edu105DAO.queryAllGrade();
		return edu105List;
	}

	// 查询某年级下的专业
	public List<Edu106> gradeMatchMajor(String gradeCode,String departmentCode) {
		List<Edu106> allByDepartmentCode = edu106DAO.findAllByDepartmentCode(departmentCode);
		return allByDepartmentCode;
	}

	// 查询培养计划下的专业课程
	public List<Edu108> queryCulturePlanCouses(Long edu107id) {
		List<Edu108> edu108List = new ArrayList<>();
		if(edu107id != null) {
			edu108List = edu108DAO.queryCulturePlanCouses(edu107id);
		}
		return edu108List;
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
	public ResultVO generatCoursePlan(JSONObject culturePlan) {
		ResultVO resultVO;

		JSONArray edu108Ids = culturePlan.getJSONArray("crouses");

		// eud108 课程更改开课计划属性
		for (int i = 0; i < edu108Ids.size(); i++) {
			String edu108Id = edu108Ids.get(i).toString();
			Edu108 edu108 = edu108DAO.findOne(Long.parseLong(edu108Id));
			edu108.setSfsckkjh("T");
			edu108DAO.save(edu108);

			Edu107 edu107 = edu107DAO.findOne(edu108.getEdu107_ID());
			Edu206 edu206 = new Edu206();
			edu206.setEdu108_ID(Long.parseLong(edu108Id));
			edu206.setPyjhmc(edu107.getPyjhmc());
			edu206.setSffbjxrws("F");
			edu206.setSfsqks("F");
			edu206.setKcmc(edu108.getKcmc());
			edu206.setZxs(edu108.getZxs().toString());
			edu206.setLlxs(edu108.getLlxs());
			edu206.setSjxs(edu108.getSjxs());
			edu206.setJzxs(edu108.getJzxs());
			edu206.setFsxs(edu108.getFsxs());
			edu206.setXf(edu108.getXf());
			edu206Dao.save(edu206);
		}

		resultVO = ResultVO.setSuccess("开课计划生成成功");
		return resultVO;
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
	public ResultVO classAction(List<Edu301> edu301List) {
		ResultVO resultVO;
		List<Edu301> edu301s = new ArrayList<>();

		for (Edu301 edu301 : edu301List) {
			String[] bhxzbids = edu301.getBhxzbid().split(",");
			String[] bhxzbmcs = edu301.getBhxzbmc().split(",");
			int count = edu300DAO.queryZXRSByEdu300Ids(bhxzbids);
			List<Edu300> edu300List = edu300DAO.findAllByEdu300Ids(bhxzbids);
			List<String> zybmList = edu300List.stream().map(Edu300::getZybm).collect(Collectors.toList());
			List<String> zymcList = edu300List.stream().map(Edu300::getZymc).collect(Collectors.toList());
			edu301.setZybm(utils.listToString(utils.heavyListMethod(zybmList),','));
			edu301.setZymc(utils.listToString(utils.heavyListMethod(zymcList),','));
			edu301.setYxbz("1");
			edu301.setJxbrs(count);
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
			edu301.setTime(df.format(new Date()));
			edu301DAO.save(edu301);

			edu301s.add(edu301);

			edu302DAO.removeByEdu301Id(edu301.getEdu301_ID().toString());
			for (int i = 0; i < bhxzbids.length; i++) {
				Edu302 save = new Edu302();
				save.setEdu301_ID(edu301.getEdu301_ID());
				save.setEdu300_ID(Long.parseLong(bhxzbids[i]));
				save.setXzbmc(bhxzbmcs[i]);
				edu302DAO.save(save);
			}
		}

		resultVO = ResultVO.setSuccess("教学班生成成功",edu301s);

		return resultVO;
	}

	// 删除教学班
	public void removeTeachingClassByID(String edu301ID) {
		edu301DAO.removeTeachingClassByID(edu301ID);
		//删除教学班行政班关联
		edu302DAO.removeByEdu301Id(edu301ID);
	}

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
	public ResultVO getAllTeachingClasses(String userId) {
		ResultVO resultVO;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		List<Edu301> edu301List = edu301DAO.findAllInDepartment(departments);

		if (edu301List.size() == 0){
			resultVO = ResultVO.setFailed("暂未找到教学班");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu301List.size()+"个教学班",edu301List);
		}
		return resultVO;
	}

	// 查询培养计划下所有学生
	public List<Edu001> queryCulturePlanStudent(String levelCode, String departmentCode, String gradeCode,
												String majorCode) {
		return edu001DAO.queryCulturePlanStudent(levelCode, departmentCode, gradeCode, majorCode);
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





	// 根据二级代码关联字段获取二级代码
	public List<Edu000> queryEjdm(String ejdmGlzd) {
		return edu000DAO.queryejdm(ejdmGlzd);
	}

	public String queryEjdmByEjdmZ(String ejdmz, String ejdmGlzd) {
		return edu000DAO.queryEjdmByEjdmZ(ejdmz, ejdmGlzd);
	}

	// 根据二级代码获取二级代码值
	public String queryEjdmZByEjdm(String ejdm, String ejdmmc) {
		return edu000DAO.queryEjdmZByEjdm(ejdm, ejdmmc);
	}

	// 根据二级代码获取二级代码值
	public String queryEjdmMcByEjdmZ(String ejdm, String ejdmmc) {
		return edu000DAO.queryEjdmMcByEjdmZ(ejdm, ejdmmc);
	}


	// 查询课程库所有课程
	public List<Edu200> queryAllClass() {
		return edu200DAO.findAll();
	}

	// 课程库通过审核课程
	public ResultVO queryAllPassCrouse(String userId) {
		ResultVO resultVO;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		List<Edu200> edu200List = edu200DAO.queryAllPassCrouse();

		if(edu200List.size() == 0){
			resultVO = ResultVO.setFailed("暂未找到课程");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu200List+"门课程",edu200List);
		}
		return resultVO;
	}

	// 根据Id查询课程
	public Edu200 queryClassById(String edu200id) {
		return edu200DAO.queryClassById(edu200id);
	}

	// 根据id删除课程
	public ResultVO libraryReomveClassByID(List<String> removeIdList,String user_id) {
		ResultVO resultVO;
		for (String s : removeIdList) {
			List<Edu108> planByEdu200Id = edu108DAO.findPlanByEdu200Id(s);
			if (planByEdu200Id.size() != 0) {
				resultVO = ResultVO.setFailed("所选课程有的存在培养计划，无法删除");
				return resultVO;
			}
		}

		for (String s : removeIdList) {
			String name = edu200DAO.findOne(Long.parseLong(s)).getKcmc();
			edu200DAO.removeLibraryClassById(s);
			addLog(user_id,3,2,s,name);
		}

		resultVO = ResultVO.setSuccess("共计删除了" + removeIdList.size() + "门课程");
		return resultVO;
	}

	// 查询操作日志
	public ResultVO selectAllLog(Edu996 edu996,String startTime,String endTime,Integer pageNum,Integer pageSize) {
		ResultVO resultVO;

		Specification<Edu996> specification = new Specification<Edu996>() {
			public Predicate toPredicate(Root<Edu996> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu996.getActionKey() != null && !"".equals(edu996.getActionKey())) {
					predicates.add(cb.equal(root.<String>get("actionKey"), edu996.getActionKey()));
				}
				if (edu996.getBussinsneType() != null && !"".equals(edu996.getBussinsneType())) {
					predicates.add(cb.equal(root.<String>get("bussinsneType"),edu996.getBussinsneType()));
				}
				if (edu996.getUser_name() != null && !"".equals(edu996.getUser_name())) {
					predicates.add(cb.like(root.<String> get("user_name"),"%"+edu996.getUser_name()+"%"));
				}
				if (edu996.getOperationalInfo() != null && !"".equals(edu996.getOperationalInfo())) {
					predicates.add(cb.like(root.<String> get("operationalInfo"),"%"+edu996.getOperationalInfo()+"%"));
				}
				if(startTime != null && !"".equals(startTime) && endTime != null && !"".equals(endTime)){
//					SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//注意月份是MM
//					try {
//						Date startTimeDate = simpleDateFormat.parse(startTime);
//						Date endTimeDate = simpleDateFormat.parse(endTime);
//						predicates.add(cb.greaterThanOrEqualTo(root.<Date>get("time"), getStartOfDay(startTimeDate)));
//						predicates.add(cb.lessThanOrEqualTo(root.<Date>get("time"),getEndOfDay(endTimeDate)));
//					}catch (Exception e){
//						e.printStackTrace();
//					}
					predicates.add(cb.greaterThanOrEqualTo(root.<String>get("time"), startTime));
					predicates.add(cb.lessThanOrEqualTo(root.<String>get("time"),endTime));
				}else if(startTime != null && !"".equals(startTime)){
//					SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//注意月份是MM
//					try {
//						Date startTimeDate = simpleDateFormat.parse(startTime);
//						predicates.add(cb.greaterThanOrEqualTo(root.<Date>get("time"), getStartOfDay(startTimeDate)));
//					}catch (Exception e){
//						e.printStackTrace();
//					}
					predicates.add(cb.greaterThanOrEqualTo(root.<String>get("time"), startTime));
				}else if(endTime != null && !"".equals(endTime)){
//					SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//注意月份是MM
//					try {
//						Date endTimeDate = simpleDateFormat.parse(endTime);
//						predicates.add(cb.lessThanOrEqualTo(root.<Date>get("time"),getEndOfDay(endTimeDate)));
//					}catch (Exception e){
//						e.printStackTrace();
//					}
					predicates.add(cb.lessThanOrEqualTo(root.<String>get("time"),endTime));
				}
				query.where(cb.and(predicates.toArray(new Predicate[predicates.size()])));
				query.orderBy(cb.desc(root.get("time")));
				return query.getRestriction();
			}
		};
		pageNum = pageNum < 0 ? 0 : pageNum;
		pageSize = pageSize < 0 ? 10 : pageSize;
		PageRequest page = new PageRequest(pageNum-1, pageSize);
		Page<Edu996> edu996List = edu996Dao.findAll(specification,page);
		List<Edu996> edu996s = edu996List.getContent();
		long count = edu996Dao.count(specification);
		if(edu996s.size() == 0){
			resultVO = ResultVO.setFailed("暂无数据");
			return resultVO;
		}
		Map<String, Object> returnMap = new HashMap<>();
		returnMap.put("rows",edu996s);
		returnMap.put("total",count);
		resultVO = ResultVO.setSuccess("共找到"+count+"条数据",returnMap);
		return resultVO;
	}

	//获得当天最大时间
	public static Date getEndOfDay(Date date) {
		LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()), ZoneId.systemDefault());

		LocalDateTime endOfDay = localDateTime.with(LocalTime.MAX);

		return Date.from(endOfDay.atZone(ZoneId.systemDefault()).toInstant());

	}

	public static Date getStartOfDay(Date date) {
		LocalDateTime localDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(date.getTime()), ZoneId.systemDefault());

		LocalDateTime startOfDay = localDateTime.with(LocalTime.MIN);

		return Date.from(startOfDay.atZone(ZoneId.systemDefault()).toInstant());

	}

	// 获取操作日志操作类型
	public ResultVO selectAllLogActionValue() {
		ResultVO resultVO;
		List<String> actionValues = new ArrayList<>();
		for(int i = 0; i<= 9;i++){
			actionValues.add(utils.getActionValue(i));
		}
		resultVO = ResultVO.setSuccess("查询成功",actionValues);
		return resultVO;
	}


	//获取可供发布的教学任务书
	public ResultVO getTaskInfo(Edu206 edu206,String departmentCode,String userId) {
		ResultVO resultVO;
		List<String> departments = new ArrayList<>();

		//判断是否指定了二级学院
		if(!"".equals(departmentCode)) {
			departments.add(departmentCode);
		} else {
			//从redis中查询二级学院管理权限
			departments.addAll((List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId));
		}
		List<Long> edu108Ids = edu108DAO.findAllBydepartments(departments);

		if(edu108Ids.size() == 0) {
			resultVO = ResultVO.setFailed("暂未找到开课计划");
			return resultVO;
		}


		Specification<Edu206> specification = new Specification<Edu206>() {
			public Predicate toPredicate(Root<Edu206> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu206.getKcmc() != null && !"".equals(edu206.getKcmc())) {
					predicates.add(cb.like(root.<String>get("kcmc"), "%"+edu206.getKcmc()+"%"));
				}
				if (edu206.getPyjhmc() != null && !"".equals(edu206.getPyjhmc())) {
					predicates.add(cb.like(root.<String>get("pyjhmc"), "%"+edu206.getPyjhmc()+"%"));
				}
				Path<Object> path = root.get("edu108_ID");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <edu108Ids.size() ; i++) {
					in.value(edu108Ids.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		List<Edu206> edu206IdList = edu206Dao.findAll(specification);


		if (edu206IdList.size() == 0){
			resultVO = ResultVO.setFailed("暂未找到开课计划");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu206IdList.size()+"条开课计划",edu206IdList);
		}

		return resultVO;
	}

	// 发布教学任务书
	public ResultVO putOutTask(List<Edu201> edu201s,Edu600 oldedu600) {
		ResultVO resultVO;
		//检查是否存在重复的任务书
		boolean isRepeat = checkRepeatTask(edu201s);

		if(isRepeat) {
			resultVO = ResultVO.setFailed("存在重复的任务书，请检查后重新发布");
			return resultVO;
		}

		for (Edu201 edu201 : edu201s) {
			Edu201 oldEdu201 = new Edu201();
			Edu600 edu600 = new Edu600();
			try {
				BeanUtils.copyProperties(edu600,oldedu600);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			//保留原始数据
			if(edu201.getEdu201_ID() != null) {
				oldEdu201 = edu201DAO.findOne(edu201.getEdu201_ID());
			}
			Integer jxbrs = 0;
			edu201.setSszt("passing");
			edu201.setSffbjxrws("T");
			//添加学院信息
			Edu108 edu108 = edu108DAO.findOne(edu201.getEdu108_ID());
			Edu107 edu107 = edu107DAO.findOne(edu108.getEdu107_ID());
			edu201.setEdu104_ID(edu107.getEdu104());
			edu201.setEdu104_mc(edu107.getEdu104mc());

			if (SecondaryCodeConstant.ADMINISTRATIVE_CLASS_TYPE.equals(edu201.getClassType())) {
				Edu300 one = edu300DAO.findOne(edu201.getClassId());
				jxbrs += one.getZxrs();
			} else {
				Edu301 one = edu301DAO.findOne(edu201.getClassId());
				jxbrs += one.getJxbrs();
			}
			edu201.setJxbrs(jxbrs.toString());
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
			edu201.setFbsj(df.format(new Date()));
			edu201DAO.save(edu201);


			edu600.setBusinessKey(edu201.getEdu201_ID());
			boolean isSuccess = approvalProcessService.initiationProcess(edu600);
			if(!isSuccess) {
				if (oldEdu201.getEdu201_ID() != null) {
					edu201DAO.save(oldEdu201);
				} else {
					edu201DAO.delete(edu201.getEdu201_ID());
				}
				resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
				return resultVO;
			}

			edu204Dao.removeByEdu201Id(edu201.getEdu201_ID().toString());

			if (SecondaryCodeConstant.ADMINISTRATIVE_CLASS_TYPE.equals(edu201.getClassType())) {
				Edu204 edu204 = new Edu204();
				edu204.setClassName(edu201.getClassName());
				edu204.setEdu201_ID(edu201.getEdu201_ID());
				edu204.setEdu300_ID(edu201.getClassId());
				edu204Dao.save(edu204);
			} else {
				List<Edu302> edu302List = edu302DAO.findClassByEdu301ID(edu201.getClassId().toString());
				for (Edu302 e : edu302List) {
					Edu204 edu204 = new Edu204();
					edu204.setClassName(e.getXzbmc());
					edu204.setEdu201_ID(edu201.getEdu201_ID());
					edu204.setEdu300_ID(e.getEdu300_ID());
					edu204Dao.save(edu204);
				}
			}

			edu205DAO.removeByEdu201Id(edu201.getEdu201_ID().toString());

			List<String> lsid = new ArrayList<>();
			List<String> lsmc = new ArrayList<>();
			List<String> zylsid = new ArrayList<>();
			List<String> zylsmc = new ArrayList<>();

			if (edu201.getLs() != null) {
				lsid = Stream.of(edu201.getLs().split(",")).collect(Collectors.toList());
				lsmc = Stream.of(edu201.getLsmc().split(",")).collect(Collectors.toList());
			}

			if (edu201.getZyls() != null) {
				zylsid = Stream.of(edu201.getZyls().split(",")).collect(Collectors.toList());
				zylsmc = Stream.of(edu201.getZylsmc().split(",")).collect(Collectors.toList());
			}

			lsid.addAll(zylsid);
			lsmc.addAll(zylsmc);
			List<String> lsId = lsid.stream().distinct().collect(Collectors.toList());
			List<String> LsMc = lsmc.stream().distinct().collect(Collectors.toList());

			for (int i = 0; i < lsId.size(); i++) {
				Edu205 save = new Edu205();
				save.setEdu201_ID(edu201.getEdu201_ID());
				save.setTeacherType("02");
				save.setEdu101_ID(Long.parseLong(lsId.get(i)));
				save.setTeacherName(LsMc.get(i));
				edu205DAO.save(save);
			}
		}


		resultVO = ResultVO.setSuccess("教学任务书发布成功");
		return resultVO;
	}

	//判断是否存在重复的任务书
	private boolean checkRepeatTask(List<Edu201> edu201s) {
		boolean isRepeat = false;

		for(Edu201 e : edu201s) {
			List<Edu201> edu201List = new ArrayList<>();
			if(e.getZyls() == null){
				edu201List.addAll(edu201DAO.findExistTaskWithOutZyls(e.getKcmc(),e.getClassId(),e.getLs()));
			} else {
				edu201List.addAll(edu201DAO.findExistTask(e.getKcmc(),e.getClassId(),e.getLs(),e.getZyls()));
			}
			if(edu201List.size()!=0){
				isRepeat = true;
				break;
			}
		}

		return isRepeat;
	}

	// 查询已发布任务书
	public ResultVO queryPutedTasks(String userId) {
		ResultVO resultVO;
		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		List<Edu201> sendTaskList = edu201DAO.findPutedTaskInfoByDepartments(departments);

		if(sendTaskList.size() == 0) {
			resultVO = ResultVO.setFailed("暂未找到任务书");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+sendTaskList.size()+"条任务书",sendTaskList);
		}
		return resultVO;
	}

	// 删除教学任务书
	public ResultVO removeTasks(List<String> deleteArray) {
		ResultVO resultVO;
		List<String> edu202Ids = edu202DAO.findEdu202ByEdu201Ids(deleteArray);
		if(edu202Ids.size() != 0) {
			resultVO = ResultVO.setFailed("存在已排课任务书，无法删除");
		} else {
			for (int i = 0; i< deleteArray.size(); i++) {
				String edu201id = deleteArray.get(i);
				//删除任务书
				edu204Dao.removeByEdu201Id(edu201id);
				edu205DAO.removeByEdu201Id(edu201id);
				edu201DAO.delete(Long.parseLong(edu201id));
			}
			resultVO = ResultVO.setSuccess("共删除了"+deleteArray.size()+"条任务书");
		}
		return resultVO;
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

	// 查询所有学年getAllXngetAllXn
	public List<Edu400> queryAllXn() {
		return edu400DAO.findAllXn();
	}

	// 根据ID查询学年
	public Edu400 getTermInfoById(String termId) {
		return edu400DAO.getTermInfoById(termId);
	}

	// 新增学年
	public ResultVO addNewXn(Edu400 edu400,String userId) {
		ResultVO resultVO;
		List<Edu400> edu400List = checkXnName(edu400);
		if(edu400List.size() != 0) {
			resultVO = ResultVO.setFailed("学年名称重复，请重新输入");
		}else {
			int actionKey = 5;
			int bussinsneType = 1;
			if(edu400.getEdu400_ID() == null){
				actionKey = 4;
				bussinsneType = 0;
			}
			edu400DAO.save(edu400);
			addLog(userId,actionKey,bussinsneType,edu400.getEdu400_ID()+"",edu400.getXnmc());
			resultVO = ResultVO.setSuccess("操作成功",edu400.getEdu400_ID());
		}
		return resultVO;
	}

	// 新增补考录入时间限制
	public ResultVO addNewMUTime(Edu404 edu404,String userId) {

		ResultVO resultVO;
		int actionKey = 8;
		int bussinsneType = 1;
		if(edu404.getEdu404_ID() == null){
			List<Edu404> edu404List = edu404Dao.findbyxnid(edu404.getXnid());
			if(edu404List.size()>0){
				resultVO = ResultVO.setFailed("该学年已设置补考录入时间");
				return resultVO;
			}
			actionKey = 7;
			bussinsneType = 0;
		}
		edu404Dao.save(edu404);
		addLog(userId,actionKey,bussinsneType,edu404.getEdu404_ID()+"",edu404.getXnmc());
		resultVO = ResultVO.setSuccess("操作成功",edu404);
		return resultVO;
	}
	//结束补考录入时间限制
	public ResultVO endNewMUTime(String edu404Id,String userId) {
		ResultVO resultVO;
		int actionKey = 9;
		int bussinsneType = 1;
		Edu404 edu404 = edu404Dao.findOne(Long.parseLong(edu404Id));
		edu404.setStatus("1");
		edu404Dao.save(edu404);
		addLog(userId,actionKey,bussinsneType,edu404.getEdu404_ID()+"",edu404.getXnmc());
		resultVO = ResultVO.setSuccess("操作成功",edu404);
		return resultVO;
	}

	//重置数据
	public ResultVO updateMUData() {
		ResultVO resultVO;
		List<Edu005> edu005List = edu005Dao.updateMUData();
		for(int i = 0;i<edu005List.size();i++){
			Edu005 edu005 = edu005List.get(i);
			List<Edu0051> edu0051List = edu0051Dao.updateMUData(edu005.getEdu005_ID()+"");
			Edu0051 edu0051 = edu0051List.get(0);
			edu0051.setGrade(edu0051List.get(edu0051List.size()-1).getGrade());
			edu0051Dao.save(edu0051);
		}
//		edu0051Dao.deleteupdateMUData();
//		edu005Dao.updateMUData2();
		resultVO = ResultVO.setSuccess("操作成功");
		return resultVO;
	}

	//开始下次补考录入时间限制
	public ResultVO startNewMUTime(String edu404Id,String userId) {
		ResultVO resultVO;
		int actionKey = 9;
		int bussinsneType = 1;
		Edu404 edu404 = edu404Dao.findOne(Long.parseLong(edu404Id));
		if("0".equals(edu404.getStatus())){
			resultVO = ResultVO.setFailed("请先结束上一次补考限制");
			return resultVO;
		}
		int count = Integer.parseInt(edu404.getCount())+1;
		if(count>5){
			resultVO = ResultVO.setFailed("已完成所有五次补考的录入，不可再次开启！");
			return resultVO;
		}
		edu404.setCount(count+"");
		edu404.setStatus("1");
		edu404Dao.save(edu404);
		addLog(userId,actionKey,bussinsneType,edu404.getEdu404_ID()+"",edu404.getXnmc());
		resultVO = ResultVO.setSuccess("操作成功",edu404);
		return resultVO;
	}


	// 新增排课课时上限
	public ResultVO addNewKssx(List<Edu403> edu403s) {
		ResultVO resultVO;
		for(int i = 0;i < edu403s.size();i++){
			Edu403 edu403 = edu403s.get(i);
			edu403DAO.save(edu403);
		}
		List<Edu400> allXn = edu400DAO.findAllXn();
		List<Edu403PO> edu403POList = new ArrayList<>();
		for (int i = 0;i < allXn.size();i++){
			List<Edu403> allKssx = edu403DAO.selectAll(allXn.get(i).getEdu400_ID().toString());
			if(allKssx.size()>0){
				Edu403PO edu403PO = new Edu403PO();
				edu403PO.setXn(allKssx.get(0).getXn());
				edu403PO.setXnid(allKssx.get(0).getXnid());
				edu403PO.setPkjsxz(allKssx);
				edu403POList.add(edu403PO);
			}
		}
		resultVO = ResultVO.setSuccess("操作成功",edu403POList);
		return resultVO;
	}
	// 根据学年id删除课时上限
	public ResultVO deleteKssxByXn(List<String> removeIdList) {
		ResultVO resultVO;
		for (String s : removeIdList) {
			edu403DAO.removeKssxByXn(s);
		}
		resultVO = ResultVO.setSuccess("删除成功");
		return resultVO;
	}

	// 根据Edu430id删除课时上限
	public ResultVO deleteKssxById(List<String> removeIdList) {
		ResultVO resultVO;
		for (String s : removeIdList) {
			edu403DAO.deleteKssxById(s);
		}
		resultVO = ResultVO.setSuccess("删除成功");
		return resultVO;
	}

	// 新增角色
	public ResultVO addNewJs(Edu402 edu402) {
		ResultVO resultVO;
		List<Edu402> edu402List = checkJsName(edu402);
		if(edu402List.size() != 0) {
			resultVO = ResultVO.setFailed("角色重复，请重新输入");
		}else {
			edu402DAO.save(edu402);
			resultVO = ResultVO.setSuccess("操作成功",edu402);
		}
		return resultVO;
	}
	//检查角色名称
	private List<Edu402> checkJsName(Edu402 edu402) {
		Specification<Edu402> specification = new Specification<Edu402>() {
			public Predicate toPredicate(Root<Edu402> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu402.getEdu402_ID() != null && !"".equals(edu402.getEdu402_ID())) {
					predicates.add(cb.notEqual(root.<String>get("edu402_ID"), edu402.getEdu402_ID()));
				}
				if (edu402.getJsid() != null && !"".equals(edu402.getJsid())) {
					predicates.add(cb.equal(root.<String>get("jsid"), edu402.getJsid()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu402> all = edu402DAO.findAll(specification);
		return all;
	}

	//检查学年名称
	private List<Edu400> checkXnName(Edu400 edu400) {
		Specification<Edu400> specification = new Specification<Edu400>() {
			public Predicate toPredicate(Root<Edu400> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu400.getEdu400_ID() != null && !"".equals(edu400.getEdu400_ID())) {
					predicates.add(cb.notEqual(root.<String>get("edu400_ID"), edu400.getEdu400_ID()));
				}
				if (edu400.getXnmc() != null && !"".equals(edu400.getXnmc())) {
					predicates.add(cb.equal(root.<String>get("xnmc"), edu400.getXnmc()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu400> all = edu400DAO.findAll(specification);
		return all;
	}

	//获取所有默认课节
	public List<Edu401> queryAllDeafultKj() {
		return edu401DAO.findAll();
	}

	public ResultVO reComfirmSchedule(String edu202Id) {
		ResultVO resultVO;
		List<Edu2011> list = edu2011DAO.reComfirmSchedule(edu202Id);
		resultVO = ResultVO.setSuccess("操作成功",list);
		return resultVO;
	}


	public boolean reSaveSchedule(String edu202Id, List<Edu203> edu203List, List<Edu207> edu207List,String userId,String userName,String sfpw) {
		boolean isSuccess = true;
		Edu202 edu202 = edu202DAO.findEdu202ById(edu202Id);
		Edu201 edu201 = edu201DAO.queryTaskByID(edu202.getEdu201_ID().toString());
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
		String time = df.format(new Date());
		edu201.setPksj(time);
		edu201DAO.save(edu201);
		edu202.setSfypw(sfpw);
		edu202DAO.save(edu202);
		Double jzxs = edu201.getJzxs();
		if(edu207List.size() != 0) {
			for (Edu207 edu207 : edu207List) {
				Edu108 edu108 = edu108DAO.findOne(edu201.getEdu108_ID());
				edu207.setClassName(edu201.getClassName());
				edu207.setEdu201_ID(edu201.getEdu201_ID().toString());
				edu207.setCourseName(edu201.getKcmc());
				edu207.setClassId(edu201.getClassId().toString());
				edu207.setEdu108_ID(edu108.getEdu108_ID().toString());
				edu207.setCourseType(edu201.getClassType());
				edu207Dao.save(edu207);
				Edu2011 edu2011 = new Edu2011();
				edu2011.setEdu202_Id(edu202Id);
				edu2011.setClassId(edu201.getClassId().toString());
				edu2011.setClassName(edu201.getClassName());
				edu2011.setKcmc(edu201.getKcmc());
				edu2011.setCzsj(time);
				edu2011.setUserId(userId);
				edu2011.setUsername(userName);
				edu2011.setType("2");
				edu2011.setWeek(edu207.getWeek());
				edu2011.setLessons(edu207.getClassHours().toString());
				edu2011DAO.save(edu2011);
			}
		}
		if(edu203List.size() != 0) {
			for (Edu203 edu203 : edu203List) {
				Edu2011 edu2011 = new Edu2011();
				edu2011.setEdu202_Id(edu202Id);
				edu2011.setClassId(edu201.getClassId().toString());
				edu2011.setClassName(edu201.getClassName());
				edu2011.setKcmc(edu201.getKcmc());
				edu2011.setCzsj(time);
				edu2011.setUserId(userId);
				edu2011.setUsername(userName);
				edu2011.setType("1");
				edu2011.setWeek(edu203.getKsz()+"-"+edu203.getJsz());
				edu2011.setLessons(edu203.getXqmc()+"-"+edu203.getKjmc());
				edu2011DAO.save(edu2011);
			}
			//重新排列课节集合
			Collections.sort(edu203List, new Comparator<Edu203>() {
				public int compare(Edu203 arg0, Edu203 arg1) {
					// 第一次比较星期
					int i = arg0.getXqid().compareTo(arg1.getXqid());
					// 如果星期相同则进行第二次比较
					if (i == 0) {
						// 第二次比较课节
						int j = arg0.getKjid().compareTo(arg1.getKjid());
						return j;
					}
					return i;
				}
			});
			Map<String, List<Edu203>> Edu203ByPoint = edu203List.stream().collect(Collectors.groupingBy(Edu203::getPointId));

			//按周保存排课计划
			AtomicInteger currentXs = new AtomicInteger();
			List<String> weekList = new ArrayList<>();

			Edu203ByPoint.forEach((key, value) -> {
				String localId = value.get(0).getLocalId();
				String localName = value.get(0).getLocalName();
				String pointId = value.get(0).getPointId();
				String pointName = value.get(0).getPointName();

				classCycle:
				for (Edu203 e : value) {
					int weekCount = Integer.parseInt(e.getJsz()) - Integer.parseInt(e.getKsz()) + 1;
					if(e.getKsz().equals(e.getJsz())) {
						weekList.add("第"+e.getKsz()+"周");
					} else {
						weekList.add("第"+e.getKsz()+"周-第"+e.getJsz()+"周");
					}
					for (int i = 0; i < weekCount; i++) {
						Edu203 save = new Edu203();
						save.setEdu202_ID(edu202Id);
						Integer week = (Integer.parseInt(e.getKsz()) + i);
						save.setWeek(week.toString());
						save.setKsz(e.getKsz());
						save.setJsz(e.getJsz());
						save.setKjid(e.getKjid());
						save.setKjmc(e.getKjmc());
						save.setXqid(e.getXqid());
						save.setXqmc(e.getXqmc());
						save.setEdu101_id(e.getEdu101_id());
						save.setTeacherName(e.getTeacherName());
						save.setTeacherType("01");
						save.setLocalId(localId);
						save.setLocalName(localName);
						save.setPointId(pointId);
						save.setPointName(pointName);
						edu203Dao.save(save);
						if(edu201.getZyls() != null) {
							String[] zyls = edu201.getZyls().split(",");
							String[] zylsmc = edu201.getZylsmc().split(",");
							for(int n = 0;n < zyls.length; n++){
								Edu203 one = new Edu203();
								one.setEdu202_ID(edu202Id);
								one.setWeek(week.toString());
								one.setKsz(e.getKsz());
								one.setJsz(e.getJsz());
								one.setKjid(e.getKjid());
								one.setKjmc(e.getKjmc());
								one.setXqid(e.getXqid());
								one.setXqmc(e.getXqmc());
								one.setEdu101_id(zyls[n]);
								one.setTeacherName(zylsmc[n]);
								one.setTeacherType("02");
								one.setLocalId(localId);
								one.setLocalName(localName);
								one.setPointId(pointId);
								one.setPointName(pointName);
								edu203Dao.save(one);
							}
						}
						currentXs.addAndGet(2);
						if (currentXs.get() >= jzxs) {
							break classCycle;
						}
					}
				}
			});
			List<String> list = (List<String>)utils.heavyListMethod(weekList);
			list.sort((a, b) -> a.compareTo(b.toString()));
			String weekName = utils.listToString(list, ',');
			edu202.setSzz(weekName);
			edu202DAO.save(edu202);
		}

		return isSuccess;
	}

	public String getedu201Idbyedu202Id(String edu202Id) {
		Edu202 edu202 = edu202DAO.findOne(Long.parseLong(edu202Id));
		return edu202.getEdu201_ID()+"";
	}
	//确认排课-检验
	public ResultVO comfirmScheduleCheck(String edu201Id,List<Edu203> edu203List) {
		ResultVO resultVO;
		Edu201 ee = edu201DAO.findOne(Long.parseLong(edu201Id));
		//班级ids
		List<Long> classIds = edu204Dao.searchEdu300IdByEdu201Id2(edu201Id);
		//获取每周的数量
		Map<Integer,Integer> map = new HashMap();
		for (int i = 0;i<edu203List.size();i++){
			Edu203 e = edu203List.get(i);
			int start = Integer.parseInt(e.getKsz());
			int end = Integer.parseInt(e.getJsz());
			for(int j = start;j<=end;j++){
				if(map.containsKey(j)){
					map.put(j,map.get(j)+1);
				}else{
					map.put(j,1);
				}
			}
		}
		for(Integer key:map.keySet()){
			String kssx = edu403DAO.queryXZCount(ee.getXnid(),key+"");
			//有课时限制时，进行课时判断
			if(kssx != null){
				//如果排课直接超过限制，则直接返回
				if(map.get(key)>Integer.parseInt(kssx)){
					resultVO = ResultVO.setFailed("第"+key+"周排课课时超过排课限制（限制为："+kssx+"节）");
					return resultVO;
				}else{
					//班级ids
					for(int i = 0;i<classIds.size();i++){
						String classId = String.valueOf(classIds.get(i));
						//获取已经排课的课时数量
						int count = teachingScheduleViewDao.comfirmScheduleCheck(classId,ee.getXnid(),key+"");
						//相加判断是否大于限制数量
						if((count+map.get(key))>Integer.parseInt(kssx)){
							Edu300 edu300 = edu300DAO.findXzbByEdu300ID(classId);
							resultVO = ResultVO.setFailed("【"+edu300.getXzbmc()+"】第"+key+"周排课课时超过排课限制（限制为："+kssx+"节）");
							return resultVO;
						}
					}

				}
			}
		}

		resultVO = ResultVO.setSuccess("验证成功");
		return resultVO;
	}
	//检查是否有排课冲突
	public ResultVO checkSchedule(List<Edu203> edu203List,String edu201Id) {
		ResultVO resultVO;
		Edu201 edu201 = edu201DAO.findOne(Long.parseLong(edu201Id));
		String xnid = edu201.getXnid();
		if(edu203List !=null && edu203List.size()>0){
			for(int i = 0;i<edu203List.size();i++){
				Edu203 edu203 = edu203List.get(i);
				for(int j = Integer.parseInt(edu203.getKsz());j<=Integer.parseInt(edu203.getJsz());j++){
					//检查该课节老师是否有别的课程安排
					if(!"虚拟教学点".equals(edu203.getLocalName())){
						List<SchoolTimetablePO> list = teachingScheduleViewDao.findCountByTeacher(edu203.getEdu101_id(),j+"",edu203.getXqid(),edu203.getKjid(),xnid);
						if(list.size()>0){
							resultVO = ResultVO.setFailed("第"+j+"周"+edu203.getXqmc()+edu203.getKjmc()+","+edu203.getTeacherName()+"教师有别的课程安排("+list.get(0).getTeacherName()+"-"+list.get(0).getClassName()+"-"+list.get(0).getCourseName()+")");
							return resultVO;
						}
					}
					//检查该教室是否被占用
					if(!"虚拟教学点".equals(edu203.getLocalName())){
						List<SchoolTimetablePO> list = teachingScheduleViewDao.findCountByPoint(edu203.getPointId(),j+"",edu203.getXqid(),edu203.getKjid(),xnid);
						if(list.size()>0){
							resultVO = ResultVO.setFailed("第"+j+"周"+edu203.getXqmc()+edu203.getKjmc()+",该'"+edu203.getPointName()+"-"+edu203.getLocalName()+"'已被占用("+list.get(0).getTeacherName()+"-"+list.get(0).getClassName()+"-"+list.get(0).getCourseName()+")");
							return resultVO;
						}
					}
					//检查该时间段行政班是否有别的课程安排
					if(SecondaryCodeConstant.ADMINISTRATIVE_CLASS_TYPE.equals(edu201.getClassType())){
						Long classId = edu201.getClassId();
						List<Edu301> edu301List = edu301DAO.queryTeachingClassByXzbCode(classId+"");
						List<String> list = new ArrayList<>();
						for(int ii = 0;ii<edu301List.size();ii++){
							list.add(edu301List.get(ii).getEdu301_ID()+"");
						}
						list.add(classId+"");
						List<SchoolTimetablePO> list2 = teachingScheduleViewDao.findCountByClass(list,j+"",edu203.getXqid(),edu203.getKjid(),xnid);
						if(list2.size()>0){
							resultVO = ResultVO.setFailed("第"+j+"周"+edu203.getXqmc()+edu203.getKjmc()+",班级:'"+edu201.getClassName()+"'已有其他课程安排("+list2.get(0).getTeacherName()+"-"+list2.get(0).getClassName()+"-"+list2.get(0).getCourseName()+")");
							return resultVO;
						}
					}else{
						Long classId = edu201.getClassId();
						Edu301 edu301 = edu301DAO.findOne(classId);
						String classIds = edu301.getBhxzbid();
						List<String> classIdss = Arrays.asList(classIds.split(","));
						for (int k = 0;k<classIdss.size();k++){
							String zxbid = classIdss.get(k);
							Edu300 edu300 = edu300DAO.findXzbByEdu300ID(zxbid);
							List<Edu301> edu301List = edu301DAO.queryTeachingClassByXzbCode(zxbid+"");
							List<String> list = new ArrayList<>();
							for(int ii = 0;ii<edu301List.size();ii++){
								list.add(edu301List.get(ii).getEdu301_ID()+"");
							}
							list.add(zxbid+"");
							List<SchoolTimetablePO> list2  = teachingScheduleViewDao.findCountByClass(list,j+"",edu203.getXqid(),edu203.getKjid(),xnid);
							if(list2.size()>0){
								resultVO = ResultVO.setFailed("第"+j+"周"+edu203.getXqmc()+edu203.getKjmc()+",班级:'"+edu300.getXzbmc()+"'已有其他课程安排("+list2.get(0).getTeacherName()+"-"+list2.get(0).getClassName()+"-"+list2.get(0).getCourseName()+")");
								return resultVO;
							}
						}
					}
				}
			}
		}
		resultVO = 	ResultVO.setSuccess("校验成功");
		return resultVO;
	}


	//确认排课
	public boolean saveSchedule(String edu201Id, List<Edu203> edu203List, List<Edu207> edu207List,String sfpw) {
		boolean isSuccess = true;
		//根据排课计划查找任务书
		Edu201 edu201 = edu201DAO.queryTaskByID(edu201Id);

		//总学时
		Double jzxs = edu201.getJzxs();

		Edu202 edu202 = new Edu202();
		edu202.setEdu201_ID(Long.parseLong(edu201Id));
		edu202.setXnid(Long.parseLong(edu201.getXnid()));
		edu202.setXnmc(edu201.getXn());
		edu202.setSfypw(sfpw);
		edu202DAO.save(edu202);
		String edu202_id = edu202.getEdu202_ID().toString();

		//如果有分散学时保存分散学时信息
		if(edu207List.size() != 0) {
			for (Edu207 edu207 : edu207List) {
				Edu108 edu108 = edu108DAO.findOne(edu201.getEdu108_ID());
				edu207.setClassName(edu201.getClassName());
				edu207.setClassId(edu201.getClassId().toString());
				edu207.setEdu108_ID(edu108.getEdu108_ID().toString());
				edu207.setCourseType(edu201.getClassType());
				edu207Dao.save(edu207);
			}
		}

		if(edu203List.size() != 0) {
			//重新排列课节集合
			Collections.sort(edu203List, new Comparator<Edu203>() {
				public int compare(Edu203 arg0, Edu203 arg1) {
					// 第一次比较星期
					int i = arg0.getXqid().compareTo(arg1.getXqid());
					// 如果星期相同则进行第二次比较
					if (i == 0) {
						// 第二次比较课节
						int j = arg0.getKjid().compareTo(arg1.getKjid());
						return j;
					}
					return i;
				}
			});
			Map<String, List<Edu203>> Edu203ByPoint = edu203List.stream().collect(Collectors.groupingBy(Edu203::getPointId));

			//按周保存排课计划
			AtomicInteger currentXs = new AtomicInteger();
			List<String> weekList = new ArrayList<>();

			Edu203ByPoint.forEach((key, value) -> {
				String localId = value.get(0).getLocalId();
				String localName = value.get(0).getLocalName();
				String pointId = value.get(0).getPointId();
				String pointName = value.get(0).getPointName();

				classCycle:
				for (Edu203 e : value) {
					int weekCount = Integer.parseInt(e.getJsz()) - Integer.parseInt(e.getKsz()) + 1;
					if(e.getKsz().equals(e.getJsz())) {
						weekList.add("第"+e.getKsz()+"周");
					} else {
						weekList.add("第"+e.getKsz()+"周-第"+e.getJsz()+"周");
					}
					for (int i = 0; i < weekCount; i++) {
						Edu203 save = new Edu203();
						save.setEdu202_ID(edu202_id);
						Integer week = (Integer.parseInt(e.getKsz()) + i);
						save.setWeek(week.toString());
						save.setKsz(e.getKsz());
						save.setJsz(e.getJsz());
						save.setKjid(e.getKjid());
						save.setKjmc(e.getKjmc());
						save.setXqid(e.getXqid());
						save.setXqmc(e.getXqmc());
						save.setEdu101_id(e.getEdu101_id());
						save.setTeacherName(e.getTeacherName());
						save.setTeacherType("01");
						save.setLocalId(localId);
						save.setLocalName(localName);
						save.setPointId(pointId);
						save.setPointName(pointName);
						edu203Dao.save(save);
						if(edu201.getZyls() != null) {
							String[] zyls = edu201.getZyls().split(",");
							String[] zylsmc = edu201.getZylsmc().split(",");
							for(int n = 0;n < zyls.length; n++){
								Edu203 one = new Edu203();
								one.setEdu202_ID(edu202_id);
								one.setWeek(week.toString());
								one.setKsz(e.getKsz());
								one.setJsz(e.getJsz());
								one.setKjid(e.getKjid());
								one.setKjmc(e.getKjmc());
								one.setXqid(e.getXqid());
								one.setXqmc(e.getXqmc());
								one.setEdu101_id(zyls[n]);
								one.setTeacherName(zylsmc[n]);
								one.setTeacherType("02");
								one.setLocalId(localId);
								one.setLocalName(localName);
								one.setPointId(pointId);
								one.setPointName(pointName);
								edu203Dao.save(one);
							}
						}
						currentXs.addAndGet(2);
						if (currentXs.get() >= jzxs) {
							break classCycle;
						}
					}
				}
			});
			List<String> list = (List<String>)utils.heavyListMethod(weekList);
			list.sort((a, b) -> a.compareTo(b.toString()));
			String weekName = utils.listToString(list, ',');
			edu202.setSzz(weekName);
			edu202DAO.save(edu202);
		}

		//找到所有老师ID并发布提醒事项
		List<String> lsid = new ArrayList<>();
		List<String> zylsid = new ArrayList<>();
		if (edu201.getLs() != null) {
			lsid = Stream.of(edu201.getLs().split(",")).collect(Collectors.toList());
		}
		if (edu201.getZyls() != null) {
			zylsid = Stream.of(edu201.getZyls().split(",")).collect(Collectors.toList());
		}
		lsid.addAll(zylsid);
		List<String> lsId = lsid.stream().distinct().collect(Collectors.toList());
		//找到二级学院ID
		Edu108 edu108 = edu108DAO.findOne(edu201.getEdu108_ID());
		Edu107 edu107 = edu107DAO.findOne(edu108.getEdu107_ID());

		Date currentTime = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateString = formatter.format(currentTime);

		for (String s : lsId) {
			Edu993 edu993 = new Edu993();
			edu993.setDepartmentCode(edu107.getEdu104());
			edu993.setRoleId(NoteConstant.TEACHER_ROLE);
			edu993.setUserId(s);
			String noticeText = "由您任教的"+edu201.getClassName()+"的"+edu201.getKcmc()+"已完成排课,请注意查看";
			edu993.setNoticeText(noticeText);
			edu993.setNoticeType(NoteConstant.TASK_NOTE);
			edu993.setBusinessType("98");
			edu993.setBusinessId(edu201Id);
			edu993.setIsHandle("F");
			edu993.setCreateDate(dateString);
			edu993Dao.save(edu993);
		}

		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
		edu201.setPksj(df.format(new Date()));
		edu201DAO.save(edu201);

		return isSuccess;
	}

	//排课后改变任务是是否已排课，并生成成绩表
	public void taskPutSchedule(String edu201ID) {
		edu201DAO.taskPutSchedule(edu201ID);
		Edu201 edu201 = edu201DAO.findOne(Long.parseLong(edu201ID));
		//查找任务书内包含的学生
		List<String> edu300IdList = edu204Dao.searchEdu300IdByEdu201Id(edu201ID);
		List<Edu001> studentList = edu001DAO.getStudentInEdu300(edu300IdList);
		//生成每个学生的成绩表
		for (Edu001 e : studentList) {
			Edu005 edu005 = new Edu005();
			edu005.setEdu001_ID(e.getEdu001_ID());
			edu005.setStudentName(e.getXm());
			edu005.setCourseName(edu201.getKcmc());
			edu005.setStudentCode(e.getXh());
			edu005.setEdu300_ID(Long.parseLong(e.getEdu300_ID()));
			edu005.setClassName(e.getXzbname());
			edu005.setEdu201_ID(Long.parseLong(edu201ID));
			edu005.setXn(edu201.getXn());
			edu005.setXnid(edu201.getXnid());
			edu005.setIsExamCrouse(edu201.getSfxylcj());
			edu005.setCredit(edu201.getXf());
//			edu005.setEdu101_ID(Long.parseLong(edu201.getLs()));
			edu005Dao.save(edu005);
		}
	}

	// 课程库搜索课程
	public ResultVO librarySeacchClass(final Edu200 edu200,String userId) {
		ResultVO resultVO;


		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);


		Specification<Edu200> specification = new Specification<Edu200>() {
			public Predicate toPredicate(Root<Edu200> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu200.getKcdm() != null && !"".equals(edu200.getKcdm())) {
					predicates.add(cb.like(root.<String>get("kcdm"), '%' + edu200.getKcdm() + '%'));
				}
				if (edu200.getKcmc() != null && !"".equals(edu200.getKcmc())) {
					predicates.add(cb.like(root.<String>get("kcmc"), '%' + edu200.getKcmc() + '%'));
				}
				if (edu200.getBzzymc() != null && !"".equals(edu200.getBzzymc())) {
					predicates.add(cb.like(root.<String>get("bzzymc"), '%' + edu200.getBzzymc() + '%'));
				}
				if (edu200.getKcxzCode() != null && !"".equals(edu200.getKcxzCode())) {
					predicates.add(cb.equal(root.<String>get("kcxzCode"), edu200.getKcxzCode()));
				}
				if (edu200.getZt() != null && !"".equals(edu200.getZt())) {
					predicates.add(cb.equal(root.<String>get("zt"), edu200.getZt()));
				}
				if (edu200.getDepartmentCode() != null && !"".equals(edu200.getDepartmentCode())) {
					predicates.add(cb.equal(root.<String>get("departmentCode"), edu200.getDepartmentCode()));
				}
				Path<Object> path = root.get("departmentCode");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <departments.size() ; i++) {
					in.value(departments.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu200> courseEntities = edu200DAO.findAll(specification);

		if (courseEntities.size() == 0) {
			resultVO = ResultVO.setFailed("暂无符合要求的数据");
		} else {
			resultVO = ResultVO.setSuccess("共找到" + courseEntities.size() + "门课程", courseEntities);
		}
		return resultVO;
	}

	// 搜索教师
	public ResultVO searchTeacher(Edu101 edu101,String userId) {
		ResultVO resultVO;
		//从redis中查询二级学院管理权限
//		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		Specification<Edu101> specification = new Specification<Edu101>() {
			public Predicate toPredicate(Root<Edu101> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu101.getSzxb() != null && !"".equals(edu101.getSzxb())) {
					predicates.add(cb.equal(root.<String>get("szxb"), edu101.getSzxb()));
				}
				if (edu101.getZy() != null && !"".equals(edu101.getZy())) {
					predicates.add(cb.equal(root.<String>get("zy"), edu101.getZy()));
				}
				if (edu101.getXm() != null && !"".equals(edu101.getXm())) {
					predicates.add(cb.like(root.<String>get("xm"), '%' + edu101.getXm() + '%'));
				}
				if (edu101.getJzgh() != null && !"".equals(edu101.getJzgh())) {
					predicates.add(cb.like(root.<String>get("jzgh"), '%' + edu101.getJzgh() + '%'));
				}
				if (edu101.getSzxbmc() != null && !"".equals(edu101.getSzxbmc())) {
					predicates.add(cb.like(root.<String>get("szxbmc"), '%' + edu101.getSzxbmc() + '%'));
				}
				if (edu101.getZc() != null && !"".equals(edu101.getZc())) {
					predicates.add(cb.equal(root.<String>get("zc"), edu101.getZc()));
				}
//				Path<Object> path = root.get("szxb");//定义查询的字段
//				CriteriaBuilder.In<Object> in = cb.in(path);
//				for (int i = 0; i <departments.size() ; i++) {
//					in.value(departments.get(i));//存入值
//				}
//				predicates.add(cb.and(in));
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu101> teacherList = edu101DAO.findAll(specification);

		if(teacherList.size() == 0) {
			resultVO = ResultVO.setFailed("暂无教师信息");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+teacherList.size()+"个教师",teacherList);
		}

		return resultVO;
	}

	// 搜索关系
	public ResultVO seacchRelation(Edu107 edu107,String userId) {
		ResultVO resultVO;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		Specification<Edu107> specification = new Specification<Edu107>() {
			public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu107.getEdu103mc() != null && !"".equals(edu107.getEdu103mc())) {
					predicates.add(cb.like(root.<String>get("edu103mc"), '%' + edu107.getEdu103mc() + '%'));
				}
				if (edu107.getPyjhmc() != null && !"".equals(edu107.getPyjhmc())) {
					predicates.add(cb.like(root.<String>get("pyjhmc"), '%' + edu107.getPyjhmc() + '%'));
				}
				if (edu107.getEdu104mc() != null && !"".equals(edu107.getEdu104mc())) {
					predicates.add(cb.like(root.<String>get("edu104mc"), '%' + edu107.getEdu104mc() + '%'));
				}
				if (edu107.getEdu105mc() != null && !"".equals(edu107.getEdu105mc())) {
					predicates.add(cb.like(root.<String>get("edu105mc"), '%' + edu107.getEdu105mc() + '%'));
				}
				if (edu107.getEdu106mc() != null && !"".equals(edu107.getEdu106mc())) {
					predicates.add(cb.like(root.<String>get("edu106mc"), '%' + edu107.getEdu106mc() + '%'));
				}
				Path<Object> path = root.get("edu104");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <departments.size() ; i++) {
					in.value(departments.get(i));//存入值
				}

				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu107> relationEntities = edu107DAO.findAll(specification);

		if(relationEntities.size() == 0) {
			resultVO = ResultVO.setFailed("暂无符合要求的培养计划");
		}else {
			resultVO = ResultVO.setSuccess("查询到"+relationEntities.size()+"条培养计划",relationEntities);
		}
		return resultVO;
	}

	// 搜索培养计划下的专业课程
	public ResultVO culturePlanSeacchCrouse(Edu108 edu108,String zt) {
		ResultVO resultVO;
		Specification<Edu108> specification = new Specification<Edu108>() {
			public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu108.getEdu107_ID() != null && !"".equals(edu108.getEdu107_ID())) {
					predicates.add(cb.equal(root.<String>get("edu107_ID"), edu108.getEdu107_ID()));
				}
				if (edu108.getKcxzCode() != null && !"".equals(edu108.getKcxzCode())) {
					predicates.add(cb.equal(root.<String>get("kcxzCode"), edu108.getKcxzCode()));
				}
				if (edu108.getKcmc() != null && !"".equals(edu108.getKcmc())) {
					predicates.add(cb.like(root.<String>get("kcmc"), '%' + edu108.getKcmc() + '%'));
				}
				if (edu108.getKsfsCode() != null && !"".equals(edu108.getKsfsCode())) {
					predicates.add(cb.equal(root.<String>get("ksfsCode"), edu108.getKsfsCode()));
				}
				if (edu108.getSfsckkjh() != null && !"".equals(edu108.getSfsckkjh())) {
					predicates.add(cb.equal(root.<String>get("sfsckkjh"), edu108.getSfsckkjh()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		List<Edu108> crouseEntities = edu108DAO.findAll(specification);
		if(zt!=null && !"".equals(zt)){
			List<Long> edu108Ids = crouseEntities.stream().map(Edu108::getEdu108_ID).collect(Collectors.toList());
			crouseEntities = edu108DAO.findByCourseZt(edu108Ids,zt);
		}

		if(crouseEntities.size() == 0) {
			resultVO = ResultVO.setFailed("暂无专业课程信息");
		}else {
			resultVO = ResultVO.setSuccess("共找到"+crouseEntities.size()+"条信息",crouseEntities);
		}

		return resultVO;
	}

	// 搜索行政班
	public ResultVO searchAdministrationClass(Edu300 edu300,String userId) {
		ResultVO resultVO;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
		String jzglx = edu101DAO.queryTeacherByUserId(userId);

		Specification<Edu300> specification = new Specification<Edu300>() {
			public Predicate toPredicate(Root<Edu300> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu300.getPyccbm() != null && !"".equals(edu300.getPyccbm())) {
					predicates.add(cb.equal(root.<String>get("pyccbm"), edu300.getPyccbm()));
				}
				if (edu300.getXbbm() != null && !"".equals(edu300.getXbbm())) {
					predicates.add(cb.equal(root.<String>get("xbbm"), edu300.getXbbm()));
				}
				if (edu300.getNjbm() != null && !"".equals(edu300.getNjbm())) {
					predicates.add(cb.equal(root.<String>get("njbm"), edu300.getNjbm()));
				}
				if (edu300.getZybm() != null && !"".equals(edu300.getZybm())) {
					predicates.add(cb.equal(root.<String>get("zybm"), edu300.getZybm()));
				}
				if (edu300.getXzbmc() != null && !"".equals(edu300.getXzbmc())) {
					predicates.add(cb.like(root.<String>get("xzbmc"), '%' + edu300.getXzbmc() + '%'));
				}
				if(jzglx!=null && !"".equals(jzglx) && !jzglx.contains("教辅人员")){
					Path<Object> path = root.get("xbbm");//定义查询的字段
					CriteriaBuilder.In<Object> in = cb.in(path);
					for (int i = 0; i <departments.size() ; i++) {
						in.value(departments.get(i));//存入值
					}
					predicates.add(cb.and(in));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu300> classEntities = edu300DAO.findAll(specification);

		if(classEntities.size() == 0 ){
			resultVO = ResultVO.setFailed("暂未查到行政班信息");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+classEntities.size()+"个行政班",classEntities);
		}

		return resultVO;
	}

	// 搜索行政班
	public ResultVO searchAdministrationClassGradeModel(Edu300 edu300,String userId) {
		ResultVO resultVO;

		String edu101Id = edu101DAO.queryTeacherIdByUserId(userId);

		List<Edu300> classEntities = edu300DAO.searchclassByID(edu101Id);

		if(classEntities.size() == 0 ){
			resultVO = ResultVO.setFailed("暂未查到行政班信息");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+classEntities.size()+"个行政班",classEntities);
		}

		return resultVO;
	}

	public ResultVO addEdu101Id() {
		ResultVO resultVO;

		List<Edu201> list = edu201DAO.findAll();
		for (int i = 0;i<list.size();i++){
			Edu201 edu201 = list.get(i);
			Edu108 edu108 = edu108DAO.findOne(edu201.getEdu108_ID());
			Edu107 edu107 = edu107DAO.findOne(edu108.getEdu107_ID());
			edu201.setEdu104_ID(edu107.getEdu104());
			edu201.setEdu104_mc(edu107.getEdu104mc());
			edu201DAO.save(edu201);
		}

		resultVO = ResultVO.setSuccess("更新成功");

		return resultVO;
	}

	// 搜索行政班
	public ResultVO searchAdministrationClassGradeModelMakeUp(String userId,String trem,List<String> couserName) {
		ResultVO resultVO;

		String edu101Id = edu101DAO.queryTeacherIdByUserId(userId);

		List<Edu300> classEntities = edu300DAO.searchAdministrationClassGradeModelMakeUp(edu101Id,trem,couserName);

		if(classEntities.size() == 0 ){
			resultVO = ResultVO.setFailed("暂未查到行政班信息");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+classEntities.size()+"个行政班",classEntities);
		}

		return resultVO;
	}

	public String getDepartmentCode (String edu104Id) {
		String departmentCode = "00";
		Edu104 edu104 = edu104DAO.query104BYID(edu104Id);
		if(edu104 != null) {
			departmentCode = edu104.getXbbm();
		}
		return departmentCode;
	}

	// 培养计划添加专业课程检索
	public ResultVO addCrouseSeacch(Edu200 edu200,String userId) {
		ResultVO resultVO;

		Specification<Edu200> specification = new Specification<Edu200>() {
			public Predicate toPredicate(Root<Edu200> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu200.getKcdm() != null && !"".equals(edu200.getKcdm())) {
					predicates.add(cb.like(root.<String>get("kcdm"), '%' + edu200.getKcdm() + '%'));
				}
				if (edu200.getKcmc() != null && !"".equals(edu200.getKcmc())) {
					predicates.add(cb.like(root.<String>get("kcmc"), '%' + edu200.getKcmc() + '%'));
				}
				if (edu200.getBzzymc() != null && !"".equals(edu200.getBzzymc())) {
					predicates.add(cb.like(root.<String>get("bzzymc"), '%' + edu200.getBzzymc() + '%'));
				}
				if (edu200.getDepartmentCode() != null && !"".equals(edu200.getDepartmentCode())) {
					predicates.add(cb.equal(root.<String>get("departmentCode"), edu200.getDepartmentCode()));
				}
				predicates.add(cb.equal(root.<String>get("zt"), "pass"));
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu200> crouseEntities = edu200DAO.findAll(specification);

		if(crouseEntities.size() == 0) {
			resultVO = ResultVO.setFailed("暂无专业课程信息");
		}else {
			resultVO = ResultVO.setSuccess("共找到"+crouseEntities.size()+"条信息",crouseEntities);
		}
		return resultVO;
	}

	// 拆班搜索学生
	public List<Edu001> breakClassSearchStudent(Edu001 edu001) {
		Specification<Edu001> specification = new Specification<Edu001>() {
			public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
					predicates.add(cb.like(root.<String>get("xm"), '%' + edu001.getXm() + '%'));
				}
				if (edu001.getEdu300_ID() != null && !"".equals(edu001.getEdu300_ID())) {
					predicates.add(cb.equal(root.<String>get("edu300_ID"), edu001.getEdu300_ID()));
				}
				if (edu001.getXb() != null && !"".equals(edu001.getXb())) {
					predicates.add(cb.equal(root.<String>get("xb"), edu001.getXb()));
				}
				if (edu001.getZtCode() != null && !"".equals(edu001.getZtCode())) {
					predicates.add(cb.equal(root.<String>get("ztCode"), edu001.getZtCode()));
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
					predicates.add(cb.like(root.<String>get("jxbmc"), '%' + edu301.getJxbmc() + '%'));
				}
				if (edu301.getBhxzbmc() != null && !"".equals(edu301.getBhxzbmc())) {
					predicates.add(cb.like(root.<String>get("bhxzbmc"), '%' + edu301.getBhxzbmc() + '%'));
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
					predicates.add(cb.equal(root.<String>get("pyccbm"), edu300.getPyccbm()));
				}
				if (edu300.getXbbm() != null && !"".equals(edu300.getXbbm())) {
					predicates.add(cb.equal(root.<String>get("xbbm"), edu300.getXbbm()));
				}
				if (edu300.getNjbm() != null && !"".equals(edu300.getNjbm())) {
					predicates.add(cb.equal(root.<String>get("njbm"), edu300.getNjbm()));
				}
				if (edu300.getZybm() != null && !"".equals(edu300.getZybm())) {
					predicates.add(cb.equal(root.<String>get("zybm"), edu300.getZybm()));
				}

				if (edu300.getXzbmc() != null && !"".equals(edu300.getXzbmc())) {
					predicates.add(cb.like(root.<String>get("xzbmc"), '%' + edu300.getXzbmc() + '%'));
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
					predicates.add(cb.like(root.<String>get("xzbmc"), '%' + edu108.getXzbmc() + '%'));
				}

				if (edu108.getKcmc() != null && !"".equals(edu108.getKcmc())) {
					predicates.add(cb.like(root.<String>get("kcmc"), '%' + edu108.getKcmc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu108> entities = edu108DAO.findAll(specification);
		return entities;
	}


	// 检索已发布的教学任务书
	public List<Edu201> searchPutOutTasks(Edu107 edu107,Edu201 edu201,String userId) {
		List<Edu201> entities = new ArrayList<>();
//		List<String> departments = new ArrayList<>();

		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		Specification<Edu107> Edu107Specification = new Specification<Edu107>() {
			public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu107.getEdu103() != null && !"".equals(edu107.getEdu103())) {
					predicates.add(cb.equal(root.<String>get("edu103"), edu107.getEdu103()));
				}
				if (edu107.getEdu104() != null && !"".equals(edu107.getEdu104())) {
					predicates.add(cb.equal(root.<String>get("edu104"), edu107.getEdu104()));
				}
				if (edu107.getEdu105() != null && !"".equals(edu107.getEdu105())) {
					predicates.add(cb.equal(root.<String>get("edu105"), edu107.getEdu105()));
				}
				if (edu107.getEdu106() != null && !"".equals(edu107.getEdu106())) {
					predicates.add(cb.equal(root.<String>get("edu106"),  edu107.getEdu106()));
				}
				Path<Object> path = root.get("edu104");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <departments.size() ; i++) {
					in.value(departments.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu107> relationEntities = edu107DAO.findAll(Edu107Specification);

		if (relationEntities.size() == 0) {
			return entities;
		}
		List<Long> edu107Ids = relationEntities.stream().map(Edu107::getEdu107_ID).collect(Collectors.toList());

		Specification<Edu108> edu108specification = new Specification<Edu108>() {
			public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				Path<Object> path = root.get("edu107_ID");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <edu107Ids.size() ; i++) {
					in.value(edu107Ids.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu108> edu108List = edu108DAO.findAll(edu108specification);

		if(edu108List.size() == 0) {
			return entities;
		}

		List<Long> edu108Ids = edu108List.stream().map(Edu108::getEdu108_ID).collect(Collectors.toList());

//		List<Long> edu108Ids = edu108DAO.findAllBydepartments(departments);

		if(edu108Ids.size() == 0) {
			return entities;
		}


		Specification<Edu201> specification = new Specification<Edu201>() {
			public Predicate toPredicate(Root<Edu201> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
//				if (edu201.getPyjhmc() != null && !"".equals(edu201.getPyjhmc())) {
//					predicates.add(cb.like(root.<String>get("pyjhmc"), '%' + edu201.getPyjhmc() + '%'));
//				}

				if (edu201.getKcmc() != null && !"".equals(edu201.getKcmc())) {
					predicates.add(cb.like(root.<String>get("kcmc"), '%' + edu201.getKcmc() + '%'));
				}

				if (edu201.getSszt() != null && !"".equals(edu201.getSszt())) {
					predicates.add(cb.equal(root.<String>get("sszt"), edu201.getSszt()));
				}

				Path<Object> path = root.get("edu108_ID");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <edu108Ids.size() ; i++) {
					in.value(edu108Ids.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		entities = edu201DAO.findAll(specification);
		return entities;
	}

	//停用课程
	public ResultVO stopClass(List<String> stopList,Edu600 edu600,String user_id) {
		ResultVO resultVO;
		for (String s : stopList) {
			edu200DAO.updateState(s, "passing");
			String kcmc = edu200DAO.findOne(Long.parseLong(s)).getKcmc();
			addLog(user_id,2,1,s,kcmc);
			edu600.setBusinessKey(Long.parseLong(s));
			boolean isSuccess = approvalProcessService.initiationProcess(edu600);
			if (!isSuccess) {
				resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
				return resultVO;
			}
		}
		resultVO = ResultVO.setSuccess("发起了" + stopList.size() + "个停课申请");
		return resultVO;
	}

	//查询全部行政班
	public List<Edu300> findAllClass(String userId) {
		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		List<Edu300> classList = edu300DAO.findAllbyDepartments(departments);
		return classList;
	}


	public List<Edu300> findClassByMajor(String edu301_id) {
		List<Edu300> classList = new ArrayList<>();
		List<Edu302> edu302List = edu302DAO.findClassByEdu301ID(edu301_id);

		if (edu302List.size() != 0) {
			Edu300 edu300 = edu300DAO.findXzbByEdu300ID(edu302List.get(0).getEdu300_ID().toString());
			classList = edu300DAO.findClassByMajor(edu300.getZybm());
		}

		return classList;
	}

	//根据Id删除排课计划
	public void removeTeachingSchedule(String scheduleId,String user_ID) {
		Edu202 edu202 = edu202DAO.findEdu202ById(scheduleId);
		edu201DAO.taskPutScheduleFalse(edu202.getEdu201_ID().toString());
		addLog(user_ID,"removeTeachingSchedule","edu201Id:"+edu202.getEdu201_ID());

		edu203Dao.deleteByscheduleId(scheduleId);
		edu005Dao.deleteByscheduleId(edu202.getEdu201_ID().toString());
		edu202DAO.delete(Long.parseLong(scheduleId));
		edu207Dao.deleteByscheduleId(edu202.getEdu201_ID().toString());

		edu993Dao.deleteByBusiness(edu202.getEdu201_ID().toString(),NoteConstant.TASK_NOTE);
	}

	//记录操作日志
	public void addLog(String user_ID,String interface_name,String param_value){
		Edu999 edu999 = new Edu999();
		edu999.setInterface_name(interface_name);
		edu999.setParam_value(param_value);
		edu999.setUser_ID(user_ID);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		edu999.setTime(df.format(new Date()));
		edu999DAO.save(edu999);
	}

	//根据条件检索已排课信息
	public Map<String, Object> searchTeachingScheduleCompleted(TeachingSchedulePO teachingSchedule,String userId) {
		Map<String, Object> returnMap = new HashMap();

		List<TeachingSchedulePO> taskList;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		Specification<TeachingSchedulePO> specification = new Specification<TeachingSchedulePO>() {
			public Predicate toPredicate(Root<TeachingSchedulePO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<>();
				if (teachingSchedule.getPyjhcc() != null && !"".equals(teachingSchedule.getPyjhcc())) {
					predicates.add(cb.equal(root.<String>get("pyjhcc"), teachingSchedule.getPyjhcc()));
				}
				if (teachingSchedule.getPyjhxb() != null && !"".equals(teachingSchedule.getPyjhxb())) {
					predicates.add(cb.equal(root.<String>get("pyjhxb"), teachingSchedule.getPyjhxb()));
				}
				if (teachingSchedule.getPyjhnj() != null && !"".equals(teachingSchedule.getPyjhnj())) {
					predicates.add(cb.equal(root.<String>get("pyjhnj"), teachingSchedule.getPyjhnj()));
				}
				if (teachingSchedule.getPyjhzy() != null && !"".equals(teachingSchedule.getPyjhzy())) {
					predicates.add(cb.equal(root.<String>get("pyjhzy"), teachingSchedule.getPyjhzy()));
				}
				if (teachingSchedule.getKcxzid() != null && !"".equals(teachingSchedule.getKcxzid())) {
					predicates.add(cb.equal(root.<String>get("kcxzid"), teachingSchedule.getKcxzid()));
				}
				if (teachingSchedule.getSfypw() != null && !"".equals(teachingSchedule.getSfypw()) && !"0".equals(teachingSchedule.getSfypw())) {
					predicates.add(cb.equal(root.<String>get("sfypw"), teachingSchedule.getSfypw()));
				}

				Path<Object> path = root.get("pyjhxb");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <departments.size() ; i++) {
					in.value(departments.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		taskList = scheduleCompletedViewDao.findAll(specification);


		returnMap.put("result", true);
		returnMap.put("taskList", taskList);
		return returnMap;
	}

	public Map<String, Object> searchScheduleCompletedDetail(String edu202Id) {
		Map<String, Object> returnMap = new HashMap();
		ScheduleCompletedDetailPO scheduleCompletedDetails = new ScheduleCompletedDetailPO();

		Edu202 edu202 = edu202DAO.findEdu202ById(edu202Id);
		Edu201 edu201 = edu201DAO.queryTaskByID(edu202.getEdu201_ID().toString());
		List<Edu207> edu207List;

		try {
			utils.copyTargetSuper(edu201, scheduleCompletedDetails);
			BeanUtils.copyProperties(scheduleCompletedDetails, edu202);
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (InvocationTargetException e) {
			e.printStackTrace();
		}

		scheduleCompletedDetails.setClassPeriodList(edu203Dao.getClassPeriodByEdu202Id(edu202Id));
		edu207List = edu207Dao.findAllByEdu201Id(edu201.getEdu201_ID().toString());

		Map<String, List<Edu203>> classPeriodMap = scheduleCompletedDetails.getClassPeriodList().stream().collect(Collectors.groupingBy(Edu203::getPointId));
		scheduleCompletedDetails.setClassPeriodMap(classPeriodMap);

		returnMap.put("result", true);
		returnMap.put("scheduleCompletedDetails", scheduleCompletedDetails);
		returnMap.put("scatterList",edu207List);

		return returnMap;
	}

	/**
	 * 新增修改课程
	 *
	 * @param edu600
	 * @param edu200
	 * @return
	 */
	public ResultVO addNewClass(Edu600 edu600, Edu200 edu200,String user_id) {
		ResultVO resultVO;
		Boolean isAdd = false;

		//声明原始数据变量
		Edu200 oldEdu200 = new Edu200();
		int actionKey = 1;
		int bussinsneType = 1;
		if(edu200.getBF200_ID() == null) {
			List<Edu200> edu200s = edu200DAO.queryAllByName(edu200.getKcmc());
			actionKey = 0;
			bussinsneType = 0;
			if (edu200s.size() != 0) {
				resultVO = ResultVO.setFailed("课程名称重复，无法添加");
				return resultVO;
			}
		}


		//如果为新增，赋予必要属性
		if (edu200.getBF200_ID() == null) {
			isAdd = true;
			String newkcdm = creatCourseCode(edu200.getDepartmentCode());
			edu200.setKcdm(newkcdm);
		} else {
			//保留原始数据
			Edu200 edu2001 = edu200DAO.queryClassById(edu200.getBF200_ID().toString());
			try {
				BeanUtils.copyProperties(oldEdu200,edu2001);
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (InvocationTargetException e) {
				e.printStackTrace();
			}
			//查询是否有培养计划正在使用该课程
			List<Edu108> edu108List = edu108DAO.findPlanByEdu200Id(edu200.getBF200_ID().toString());
			if (edu108List.size() != 0) {
				resultVO = ResultVO.setFailed("存在培养计划正在使用课程，不可修改");
				return resultVO;
			}
		}

		long currentTimeStamp = System.currentTimeMillis();
		edu200.setLrsj(currentTimeStamp);
		String newClassStatus = "passing";
		edu200.setZt(newClassStatus);
		edu200DAO.save(edu200);
		edu600.setBusinessKey(edu200.getBF200_ID());
		boolean isSuccess = approvalProcessService.initiationProcess(edu600);
		if (!isSuccess) {
			if (isAdd) {
				edu200DAO.delete(edu200.getBF200_ID());
			} else {
				edu200DAO.save(oldEdu200);
			}
			resultVO = ResultVO.setApprovalFailed("审批流程发起失败，请联系管理员处理");
			return resultVO;
		}
		//增加日志
		String bussinsneinfo = edu200.getBF200_ID()+"";
		addLog(user_id,actionKey,bussinsneType,bussinsneinfo,edu200.getKcmc());
		resultVO = ResultVO.setSuccess("操作成功", edu200);
		return resultVO;
	}

	//生成课程代码
	public String creatCourseCode(String departmentId) {
		String courseCode = "";
		String departmentCode = getDepartmentCode(departmentId);
		courseCode= departmentCode+utils.getRandom(4);
		return courseCode;
	}


	//查询是否有重复的课程名称或课程代码
	public List<Edu200> findCourseByKcmdOrKcdm(Edu200 edu200) {
		Specification<Edu200> specification = new Specification<Edu200>() {
			public Predicate toPredicate(Root<Edu200> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu200.getBF200_ID() != null && !"".equals(edu200.getBF200_ID())) {
					predicates.add(cb.notEqual(root.<String>get("BF200_ID"), edu200.getBF200_ID()));
				}
				if (edu200.getKcmc() != null && !"".equals(edu200.getKcmc())) {
					predicates.add(cb.equal(root.<String>get("kcmc"), edu200.getKcmc()));
				}
				if (edu200.getKcdm() != null && !"".equals(edu200.getKcdm())) {
					predicates.add(cb.equal(root.<String>get("kcdm"), edu200.getKcdm()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu200> edu200List = edu200DAO.findAll(specification);
		return edu200List;
	}

	//查询所有开课部门
	public List<Edu104> queryAllKkbm() {
		return edu104DAO.queryAllKkbm();
	}

	//查询所有排课部门
	public List<Edu104> queryAllPkbm() {
		return edu104DAO.queryAllPkbm();
	}


	/**
	 * 导入课程
	 *
	 * @param multipartRequest
	 * @return
	 */
	public ResultVO importNewClass(MultipartHttpServletRequest multipartRequest) {
		ResultVO resultVO;
		MultipartFile file = multipartRequest.getFile("file"); //文件流
		String lrrInfo = multipartRequest.getParameter("lrrInfo"); //接收客户端传入文件携带的录入人参数
		String approvalInfo = multipartRequest.getParameter("approvalInfo"); //接收客户端传入文件携带的审批流参数
		//格式化录入人信息
		JSONObject jsonObject = JSONObject.fromObject(lrrInfo);
		String lrrmc = jsonObject.getString("lrr");
		String userId = jsonObject.getString("userId");
		String userKey = jsonObject.getString("userykey");
		//格式化审批流信息
		JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
		Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);

		Map<String, Object> returnMap = null;
		try {
			returnMap = utils.checkNewClassFile(file, "ImportClass", "导入课程信息");
		} catch (Exception e) {
			e.printStackTrace();
		}

		boolean modalPass = (boolean) returnMap.get("modalPass");
		if (!modalPass) {
			resultVO = ResultVO.setFailed("模版错误，导入失败", returnMap);
			return resultVO;
		}

		if (!returnMap.get("dataCheck").equals("")) {
			boolean dataCheck = (boolean) returnMap.get("dataCheck");
			if (!dataCheck) {
				resultVO = ResultVO.setFailed("数据格式有误，请修改后重试", returnMap);
				return resultVO;
			}
		}

		Integer count = 0;
		List<String> saveIds = new ArrayList<>();
		if (!returnMap.get("importClasses").equals("")) {
			List<Edu200> importClasses = (List<Edu200>) returnMap.get("importClasses");
			count = importClasses.size();
			for (int i = 0; i < importClasses.size(); i++) {
				Edu200 edu200 = importClasses.get(i);
				edu200.setLrr(lrrmc);
				edu200.setLrrID(Long.parseLong(userKey));
				ResultVO result = addNewClass(edu600, edu200,userId);
				if (result.getCode() == 500) {
					resultVO = ResultVO.setFailed("数据导入失败");
					if (saveIds.size() != 0) {
						edu200DAO.deleteByIds(saveIds);
					}
					return resultVO;
				} else if (result.getCode() == 501) {
					resultVO = ResultVO.setApprovalFailed("审批流程发起失败，请联系管理员",returnMap);
					if (saveIds.size() != 0) {
						edu200DAO.deleteByIds(saveIds);
					}
					return resultVO;
				}
				saveIds.add(edu200.getBF200_ID().toString());
			}
		}

		resultVO = ResultVO.setSuccess("成功导入了" + count + "门课程", returnMap);
		return resultVO;
	}

	/**
	 * 批量修改课程
	 *
	 * @param multipartRequest
	 * @return
	 * @throws Exception
	 */
	public ResultVO modifyClassess(MultipartHttpServletRequest multipartRequest) {
		ResultVO resultVO;
		MultipartFile file = multipartRequest.getFile("file"); //文件流
		String lrrInfo = multipartRequest.getParameter("lrrInfo"); //接收客户端传入文件携带的录入人参数
		String approvalInfo = multipartRequest.getParameter("approvalInfo"); //接收客户端传入文件携带的审批流参数
		//格式化录入人信息
		JSONObject jsonObject = JSONObject.fromObject(lrrInfo);
		String lrrmc = jsonObject.getString("lrr");
		String userId = jsonObject.getString("userId");
		String userKey = jsonObject.getString("userykey");
		//格式化审批流信息
		JSONObject approvalObject = JSONObject.fromObject(approvalInfo);
		Edu600 edu600 = (Edu600) JSONObject.toBean(approvalObject, Edu600.class);

		Map<String, Object> returnMap = null;
		try {
			returnMap = utils.checkNewClassFile(file, "ModifyEdu200", "已选课程信息");
		} catch (Exception e) {
			e.printStackTrace();
		}
		boolean modalPass = (boolean) returnMap.get("modalPass");
		if (!modalPass) {
			resultVO = ResultVO.setFailed("模版错误，导入失败", returnMap);
			return resultVO;
		}

		if (!returnMap.get("dataCheck").equals("")) {
			boolean dataCheck = (boolean) returnMap.get("dataCheck");
			if (!dataCheck) {
				resultVO = ResultVO.setFailed("数据格式有误，请修改后重试", returnMap);
				return resultVO;
			}
		}


		Integer count = 0;
		List<Edu200> saveList = new ArrayList<>();
		List<Edu200> updateClasses;
		if (!returnMap.get("importClasses").equals("")) {
			updateClasses = (List<Edu200>) returnMap.get("importClasses");
			count = updateClasses.size();
			for (int i = 0; i < updateClasses.size(); i++) {
				Edu200 edu200 = updateClasses.get(i);
				//保留原始数据
				Edu200 oldEdu200 = edu200DAO.queryClassById(edu200.getBF200_ID().toString());
				edu200.setLrr(lrrmc);
				edu200.setLrrID(Long.parseLong(userKey));
				edu200.setShr(null);
				edu200.setShrID(null);
				ResultVO result = addNewClass(edu600, edu200,userId);
				if (result.getCode() == 500) {
					resultVO = ResultVO.setFailed("数据导入失败");
					if (saveList.size() != 0) {
						for (Edu200 e : saveList) {
							edu200DAO.save(e);
						}
					}
					return resultVO;
				} else if (result.getCode() == 501) {
					resultVO = ResultVO.setApprovalFailed("审批流程发起失败，请联系管理员",returnMap);
					if (saveList.size() != 0) {
						for (Edu200 e : saveList) {
							edu200DAO.save(e);
						}
					}
					return resultVO;
				}
				saveList.add(oldEdu200);
			}
			returnMap.put("modifyClassesInfo", updateClasses);
		}

		resultVO = ResultVO.setSuccess("成功修改了" + count + "门课程", returnMap);
		return resultVO;
	}

	//获取教学公共代码
	public ResultVO getJxPublicCodes() {
		ResultVO resultVO;
		Map<String, Object> returnMap = new HashMap();
		List<Edu400> allXn = edu400DAO.findAllXn();
		List<Edu402> allJs = edu402DAO.findAll();
		List<Edu403PO> edu403POList = new ArrayList<>();
		for (int i = 0;i < allXn.size();i++){
			List<Edu403> allKssx = edu403DAO.selectAll(allXn.get(i).getEdu400_ID().toString());
			if(allKssx.size()>0){
				Edu403PO edu403PO = new Edu403PO();
				edu403PO.setXn(allKssx.get(0).getXn());
				edu403PO.setXnid(allKssx.get(0).getXnid());
				edu403PO.setPkjsxz(allKssx);
				edu403POList.add(edu403PO);
			}
		}
		List<Edu404> allMUxz = edu404Dao.findAll();
		returnMap.put("allXn", allXn);
		returnMap.put("allJs", allJs);
		returnMap.put("allKssx", edu403POList);
		returnMap.put("allMUxz", allMUxz);
		resultVO = ResultVO.setSuccess("查询成功", returnMap);
		return resultVO;
	}

	//生成教学班学生名单
	public ResultVO exportRollcallExcel(HttpServletRequest request, HttpServletResponse response,List<String> edu301IdList) {
		ResultVO resultVO;
		List<String> edu300IdList = new ArrayList<>();
		for (String s : edu301IdList) {
			List<String> idList = edu302DAO.findEdu300IdsByEdu301Id(s);
			edu300IdList.addAll(idList);
		}
		edu300IdList = utils.heavyListMethod(edu300IdList);

		List<Edu001> studentInEdu300 = edu001DAO.getStudentInEdu300(edu300IdList);

		if(studentInEdu300.size() == 0) {
			resultVO = ResultVO.setFailed("教学班内暂无学生");
			return resultVO;
		}

		boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
		String fileName="";
		if(isIE){
			fileName="studentInTeachingClass";
		}else{
			fileName="教学班学生名单";
		}
		//创建Excel文件
		XSSFWorkbook workbook  = new XSSFWorkbook();
		utils.createStudentModal(workbook,studentInEdu300);
		try {
			utils.loadModal(response,fileName, workbook);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		}

		resultVO = ResultVO.setSuccess("生成成功");
		return resultVO;
	}


	//修改培养计划课程
	public ResultVO modifyCultureCrose(String edu107Id, Edu108 edu108, Edu600 edu600) {
		ResultVO resultVO;
		edu108DAO.save(edu108);
		resultVO = ResultVO.setSuccess("修改成功",edu108);
		return resultVO;
	}


	//新增培养计划专业课程
	public ResultVO culturePlanAddCrouse(String edu107Id, Edu108 edu108) {
		ResultVO resultVO;
		edu108.setEdu107_ID(Long.parseLong(edu107Id));
		edu108.setSfsckkjh("F");// 初始化的是否生成开课计划
		edu108DAO.save(edu108);
		resultVO = ResultVO.setSuccess("保存成功",edu108);
		return resultVO;
	}

	//生成开课计划查询课程库和班级信息
	public ResultVO getGeneratCoursePalnInfo(String edu107_id) {
		ResultVO resultVO;
		Map<String, Object> returnMap = new HashMap();
		Edu107 edu107 = edu107DAO.findOne(Long.parseLong(edu107_id));
		// 培养计划下的课程
		List<Edu108> couserInfo = queryCulturePlanCouses(Long.parseLong(edu107_id));
		returnMap.put("tableInfo", couserInfo);
		resultVO = ResultVO.setSuccess("查询成功",returnMap);
		return resultVO;
	}


	//生成专业下所有课程开课计划
	public ResultVO generatAllClassAllCourse(String edu107_id) {
		ResultVO resultVO;

		Edu107 edu107 = edu107DAO.findOne(Long.parseLong(edu107_id));

		// 查询培养计划下的行政班
		List<Edu300> administrationClasses = queryCulturePlanAdministrationClasses(edu107.getEdu103(), edu107.getEdu104(), edu107.getEdu105(), edu107.getEdu106());
		List<String> classNames = new ArrayList();
		List<String> classIds = new ArrayList();
		for (int i = 0; i < administrationClasses.size(); i++) {
			classNames.add(administrationClasses.get(i).getXzbmc());
			classIds.add(administrationClasses.get(i).getEdu300_ID().toString());
		}

		// 查询培养计划下所有课程
		List<Edu108> allCrouse = queryCulturePlanCouses(Long.parseLong(edu107_id));
		String isGeneratCoursePlan = "T";
		List<Edu108> crouseInfo = new ArrayList();
		for (int i = 0; i < allCrouse.size(); i++) {
			// 课程通过审核则生成开课计划
			if (allCrouse.get(i).getXbsp().equals("pass")) {
				for (int g = 0; g < administrationClasses.size(); g++) {
					for (int c = 0; c < classIds.size(); c++) {
						// eud300 行政班更改开课计划属性
						generatAdministrationCoursePlan(classIds.get(i), isGeneratCoursePlan);
					}

					// eud180 课程更改开课计划属性
					edu108DAO.chengeCulturePlanCrouseFeedBack(allCrouse.get(i).getEdu108_ID().toString(), JSONArray.fromObject(classNames).toString(),
							JSONArray.fromObject(classIds).toString(), isGeneratCoursePlan);
					Edu108 edu108 = allCrouse.get(i);
					edu108.setSfsckkjh(isGeneratCoursePlan);
					edu108.setEdu300_ID(JSONArray.fromObject(classIds).toString());
					edu108.setXzbmc(JSONArray.fromObject(classNames).toString());
					crouseInfo.add(edu108);
				}
			}
		}

		resultVO = ResultVO.setSuccess("已生成专业下所有班级课程",crouseInfo);
		return resultVO;
	}


	public ResultVO findPlanCourse(String edu107Id) {
		ResultVO resultVO;
		List<Edu108> edu108List = edu108DAO.queryCulturePlanCouses(Long.parseLong(edu107Id));
		if(edu108List.size() == 0) {
			resultVO = ResultVO.setFailed("暂未查到专业课程",edu108List);
		}else {
			resultVO = ResultVO.setSuccess("共查询到"+edu108List.size()+"条专业课程",edu108List);
		}
		return resultVO;
	}


	//根据权限查询系部
	public ResultVO getUsefulDepartment(String userId) {
		ResultVO resultVO;
		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);
		List<Edu104> edu104s = edu104DAO.query104BYdepartments(departments);
		if (edu104s.size() == 0) {
			resultVO = ResultVO.setFailed("暂无二级学院信息");
		} else {
			resultVO = ResultVO.setSuccess("共查到"+edu104s.size()+"个学院信息",edu104s);
		}
		return resultVO;
	}

	//根据班级类型查询班级
	public ResultVO getClassBytype(String classType,String userId) {
		ResultVO resultVO;
		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		if(classType.equals(SecondaryCodeConstant.ADMINISTRATIVE_CLASS_TYPE)) {
			List<Edu300> edu300List = edu300DAO.findAdministrativeClassForTask(departments);
			if(edu300List.size() == 0){
				resultVO = ResultVO.setFailed("暂无班级信息");
			} else {
				resultVO = ResultVO.setSuccess("查询成功",edu300List);
			}
		} else {
			List<Edu301> edu301List = edu301DAO.findTeachingClassForTask(departments);
			if(edu301List.size() == 0){
				resultVO = ResultVO.setFailed("暂无班级信息");
			} else {
				resultVO = ResultVO.setSuccess("查询成功",edu301List);
			}
		}
		return resultVO;
	}

	//检查教学班是否被使用
	public ResultVO checkTeachingClassInTask(List<String> classIdList) {
		ResultVO resultVO;
		List<Long> classIds = edu201DAO.checkTeachingClassInTask(classIdList);
		if(classIds.size() == 0) {
			resultVO = ResultVO.setSuccess("没有正在使用的教学班，可以操作");
		} else {
			resultVO = ResultVO.setFailed("存在正在使用的教学班，无法操作");
		}
		return resultVO;
	}

	public ResultVO confirmStartPlan(Edu600 edu600) {
		ResultVO resultVO;
		boolean isSuccess = approvalProcessService.initiationProcess(edu600);
		if (isSuccess) {
			edu107DAO.changeProcessState("passing",edu600.getBusinessKey().toString());
			resultVO = ResultVO.setSuccess("申请成功");
		} else {
			resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
		}
		return resultVO;
	}


	//违纪学生查询
	public ResultVO findBreakStudent(StudentBreakPO studentBreakPO) {
		ResultVO resultVO;

		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + studentBreakPO.getUserId());

		List<String> studentIdList = edu006Dao.findStudentIdList();

		if (studentIdList.size() == 0) {
			resultVO = ResultVO.setFailed("暂无违纪学生");
			return resultVO;
		}

		Specification<Edu001> specification = new Specification<Edu001>() {
			public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (studentBreakPO.getLevel() != null && !"".equals(studentBreakPO.getLevel())) {
					predicates.add(cb.equal(root.<String> get("pycc"), studentBreakPO.getLevel()));
				}
				if (studentBreakPO.getDepartment() != null && !"".equals(studentBreakPO.getDepartment())) {
					predicates.add(cb.equal(root.<String> get("szxb"), studentBreakPO.getDepartment()));
				}
				if (studentBreakPO.getGrade() != null && !"".equals(studentBreakPO.getGrade())) {
					predicates.add(cb.equal(root.<String> get("nj"), studentBreakPO.getGrade()));
				}
				if (studentBreakPO.getMajor() != null && !"".equals(studentBreakPO.getMajor())) {
					predicates.add(cb.equal(root.<String> get("zybm"), studentBreakPO.getMajor()));
				}
				if (studentBreakPO.getSex() != null && !"".equals(studentBreakPO.getSex())) {
					predicates.add(cb.equal(root.<String> get("xb"), studentBreakPO.getSex()));
				}
				if (studentBreakPO.getName() != null && !"".equals(studentBreakPO.getName())) {
					predicates.add(cb.like(root.<String> get("xm"), '%' + studentBreakPO.getName() + '%'));
				}
				if (studentBreakPO.getClassName() != null && !"".equals(studentBreakPO.getClassName())) {
					predicates.add(cb.like(root.<String> get("xzbname"), '%' + studentBreakPO.getClassName() + '%'));
				}

				Path<Object> path = root.get("szxb");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <departments.size() ; i++) {
					in.value(departments.get(i));//存入值
				}
				predicates.add(cb.and(in));

				Path<Object> idPath = root.get("edu001_ID");//定义查询的字段
				CriteriaBuilder.In<Object> idIn = cb.in(idPath);
				for (int i = 0; i <studentIdList.size() ; i++) {
					idIn.value(Long.parseLong(studentIdList.get(i)));//存入值
				}
				predicates.add(cb.and(idIn));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu001> classesEntities = edu001DAO.findAll(specification);

		if (classesEntities.size() == 0) {
			resultVO = ResultVO.setFailed("暂无违纪学生");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+classesEntities.size()+"个违纪学生",classesEntities);
		}

		return resultVO;
	}

	//新增学生违纪
	public ResultVO addStudentBreak(Edu006 edu006) {
		ResultVO resultVO;
		Date currentTime = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateString = formatter.format(currentTime);
		edu006.setCreatDate(dateString);
		edu006Dao.save(edu006);

		String[] studentIds = edu006.getEdu001_ID().split(",");
		String[] studentName = edu006.getStudentName().split(",");
		for (int i = 0; i < studentIds.length; i++) {
			Edu007 edu007 = new Edu007();
			edu007.setEdu006_ID(edu006.getEdu006_ID());
			edu007.setEdu001_ID(studentIds[i]);
			edu007.setStudentName(studentName[i]);
			edu007Dao.save(edu007);

			//发布提醒事项
			Edu001 edu001 = edu001DAO.findOne(Long.parseLong(studentIds[i]));
			Edu993 edu993 = new Edu993();
			edu993.setDepartmentCode(edu001.getSzxb());
			edu993.setRoleId(NoteConstant.STUDENT_ROLE);
			edu993.setUserId(edu001.getEdu001_ID().toString());
			String noticeText = "您有一条"+edu006.getBreachName()+"违纪记录,请注意查看";
			edu993.setNoticeText(noticeText);
			edu993.setNoticeType(NoteConstant.BREAK_NOTE);
			edu993.setBusinessType("99");
			edu993.setBusinessId(edu007.getEdu007_ID().toString());
			edu993.setIsHandle("T");
			edu993.setCreateDate(dateString);
			edu993Dao.save(edu993);

		}

		resultVO = ResultVO.setSuccess("保存违纪信息成功",edu006);
		return resultVO;
	}


	//根据学生查找违纪记录
	public ResultVO searchBreakInfoByStudent(String studentId) {
		ResultVO resultVO;

		List<Edu006> edu006List = edu006Dao.findAllByEdu006Ids(studentId);

		if (edu006List.size() == 0) {
			resultVO = ResultVO.setFailed("未找到学生违纪记录");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu006List.size()+"条违纪记录",edu006List);
		}

		return resultVO;
	}

	//撤销违纪记录
	public ResultVO cancelBreakInfo(String cancelId,String studentId) {
		ResultVO resultVO;
		Date currentTime = new Date();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String dateString = formatter.format(currentTime);
		edu007Dao.cancelBreakByEdu006Id(dateString,cancelId,studentId);
		Edu007 edu007 = edu007Dao.findOneByEdu106IdAndStudent(cancelId,studentId);
		edu993Dao.deleteByBusiness(edu007.getEdu007_ID().toString(),NoteConstant.BREAK_NOTE);

		resultVO = ResultVO.setSuccess("撤销违纪成功",dateString);
		return resultVO;
	}

	//检查行政班是否生成任务书
	public ResultVO checkClassUsed(List<String> classIdList) {
		ResultVO resultVO;
		List<Edu204> edu204List = edu204Dao.findAllbyEdu300Ids(classIdList);
		if (edu204List.size() != 0) {
			resultVO = ResultVO.setSuccess("行政班不可修改");
		} else {
			resultVO = ResultVO.setFailed("行政可以修改");
		}
		return resultVO;
	}


	//查询已排课程
	public ResultVO getTaskByCulturePlanByUser(Edu107 edu107, Edu108 edu108, String userId) {
		ResultVO resultVO;
		//从redis中查询二级学院管理权限
		List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

		Specification<Edu107> Edu107Specification = new Specification<Edu107>() {
			public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu107.getEdu103() != null && !"".equals(edu107.getEdu103())) {
					predicates.add(cb.equal(root.<String>get("edu103"), edu107.getEdu103()));
				}
				if (edu107.getEdu104() != null && !"".equals(edu107.getEdu104())) {
					predicates.add(cb.equal(root.<String>get("edu104"), edu107.getEdu104()));
				}
				if (edu107.getEdu105() != null && !"".equals(edu107.getEdu105())) {
					predicates.add(cb.equal(root.<String>get("edu105"), edu107.getEdu105()));
				}
				if (edu107.getEdu106() != null && !"".equals(edu107.getEdu106())) {
					predicates.add(cb.equal(root.<String>get("edu106"),  edu107.getEdu106()));
				}
				Path<Object> path = root.get("edu104");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <departments.size() ; i++) {
					in.value(departments.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu107> relationEntities = edu107DAO.findAll(Edu107Specification);

		if (relationEntities.size() == 0) {
			resultVO = ResultVO.setFailed("暂无可排课程");
			return resultVO;
		}
		List<Long> edu107Ids = relationEntities.stream().map(Edu107::getEdu107_ID).collect(Collectors.toList());

		Specification<Edu108> edu108specification = new Specification<Edu108>() {
			public Predicate toPredicate(Root<Edu108> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu108.getKcxzCode() != null && !"".equals(edu108.getKcxzCode())) {
					predicates.add(cb.equal(root.<String>get("kcxzCode"), edu108.getKcxzCode()));
				}
				Path<Object> path = root.get("edu107_ID");//定义查询的字段
				CriteriaBuilder.In<Object> in = cb.in(path);
				for (int i = 0; i <edu107Ids.size() ; i++) {
					in.value(edu107Ids.get(i));//存入值
				}
				predicates.add(cb.and(in));

				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu108> edu108List = edu108DAO.findAll(edu108specification);

		if(edu108List.size() == 0) {
			resultVO = ResultVO.setFailed("暂无可排课程");
			return resultVO;
		}

		List<Long> edu108Ids = edu108List.stream().map(Edu108::getEdu108_ID).collect(Collectors.toList());
		List<Edu201> edu201List = edu201DAO.queryCulturePlanIds(edu108Ids);

		if(edu201List.size() == 0) {
			resultVO = ResultVO.setFailed("暂无可排课程");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu201List.size()+"门可排课程",edu201List);
		}
		return resultVO;
	}

	public List<Edu500> queryAllLocal() {
		List<Edu500> edu500List = edu500Dao.findAll();
		return edu500List;
	}


	//查询全部二级学院
	public ResultVO getAllDepartment() {
		ResultVO resultVO;
		List<Edu104> edu104s = edu104DAO.findAll();
		if (edu104s.size() == 0) {
			resultVO = ResultVO.setFailed("暂无二级学院信息");
		} else {
			resultVO = ResultVO.setSuccess("共查到"+edu104s.size()+"个学院信息",edu104s);
		}
		return resultVO;
	}

	public ResultVO searchScheduleInfoAgain(String edu202Id) {
		ResultVO resultVO;
		Map<String, Object> returnMap = new HashMap<>();
		Edu202 edu202 = edu202DAO.findOne(Long.parseLong(edu202Id));
		Edu201 edu201 = edu201DAO.findOne(edu202.getEdu201_ID());
		List<Edu203> edu203List = edu203Dao.getClassPeriodByEdu202IdDist(edu202Id);
		List<Edu203> edu203ListSize = edu203Dao.getClassPeriodByEdu202Id(edu202Id);
		Long fsxs = edu207Dao.findFsxsSumByEdu201Id(edu202.getEdu201_ID().toString());
		if (fsxs == null && new Double(edu201.getJzxs()).intValue() == (edu203ListSize.size()*2)) {
			returnMap.put("status","T");
		}else if(fsxs != null){
			if(new Double(edu201.getJzxs()).intValue() == (edu203ListSize.size()*2) && fsxs.intValue() == new Double(edu201.getFsxs()).intValue()){
				returnMap.put("status","T");
			}else{
				returnMap.put("status","F");
				List<Edu207> edu207List = edu207Dao.findAllByEdu201Id(edu201.getEdu201_ID().toString());
				returnMap.put("edu201",edu201);
				returnMap.put("edu203List",edu203List);
				returnMap.put("edu207List",edu207List);
			}
		}else{
			returnMap.put("status","F");
			List<Edu207> edu207List = edu207Dao.findAllByEdu201Id(edu201.getEdu201_ID().toString());
			returnMap.put("edu201",edu201);
			returnMap.put("edu203List",edu203List);
			returnMap.put("edu207List",edu207List);
		}
		resultVO = ResultVO.setSuccess("查询成功",returnMap);
		return resultVO;
	}


	//查询排课所有信息
	public ResultVO searchScheduleInfo(String edu202Id) {
		ResultVO resultVO;
		Map<String,Object> returnMap = new HashMap<>();
		Edu202 edu202 = edu202DAO.findOne(Long.parseLong(edu202Id));
		Edu201 edu201 = edu201DAO.findOne(edu202.getEdu201_ID());
		List<Edu203> edu203List = edu203Dao.getClassPeriodByEdu202Id(edu202Id);
		List<Edu207> edu207List = edu207Dao.findAllByEdu201Id(edu201.getEdu201_ID().toString());
		returnMap.put("edu202",edu202);
		returnMap.put("edu203List",edu203List);
		returnMap.put("edu207List",edu207List);
		resultVO = ResultVO.setSuccess("查询成功",returnMap);
		return resultVO;
	}


	//根据二级学院查询专业
	public ResultVO searchMajorByDepartment(String departmentCode) {
		ResultVO resultVO;
		List<Edu106> edu106List = edu106DAO.findAllByDepartmentCode(departmentCode);
		if (edu106List.size() == 0) {
			resultVO = ResultVO.setFailed("该学院下暂无专业");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+edu106List.size()+"条专业",edu106List);
		}
		return resultVO;
	}

	public ResultVO searchAllTeacher(Edu101 edu101) {
		ResultVO resultVO;

		Specification<Edu101> specification = new Specification<Edu101>() {
			public Predicate toPredicate(Root<Edu101> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu101.getXm() != null && !"".equals(edu101.getXm())) {
					predicates.add(cb.like(root.<String>get("xm"), '%' + edu101.getXm() + '%'));
				}
				if (edu101.getJzgh() != null && !"".equals(edu101.getJzgh())) {
					predicates.add(cb.like(root.<String>get("jzgh"), '%' + edu101.getJzgh() + '%'));
				}
				if (edu101.getSzxbmc() != null && !"".equals(edu101.getSzxbmc())) {
					predicates.add(cb.like(root.<String>get("szxbmc"), '%' + edu101.getSzxbmc() + '%'));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu101> teacherList = edu101DAO.findAll(specification);

		if(teacherList.size() == 0) {
			resultVO = ResultVO.setFailed("暂无教师信息");
		} else {
			resultVO = ResultVO.setSuccess("共找到"+teacherList.size()+"个教师",teacherList);
		}

		return resultVO;
	}

	public Boolean checkClassRepeat(Long edu300_id, String xzbmc) {
		Boolean nameHave;
		List<Edu300> edu300List = edu300DAO.checkClassRepeat(edu300_id, xzbmc);
		if (edu300List.size() != 0) {
			nameHave = true;
		} else {
			nameHave = false;
		}
		return nameHave;
	}

	//检索是否存在成绩
	public List<Edu005> checkGradeInfo(Edu005 edu005) {
		//根据条件筛选成绩表
		Specification<Edu005> edu005Specification = new Specification<Edu005>() {
			public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
					predicates.add(cb.equal(root.<String>get("courseName"), edu005.getCourseName()));
				}
				if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
					predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
				}
				if (edu005.getClassName() != null && !"".equals(edu005.getClassName())) {
					predicates.add(cb.equal(root.<String>get("className"),edu005.getClassName()));
				}
//				predicates.add(cb.equal(root.<String>get("isExamCrouse"),"T"));
				predicates.add(cb.isNull(root.<String>get("isConfirm")));
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

		if(edu005List.size() != 0){
			Edu201 one = edu201DAO.getOne(edu005List.get(0).getEdu201_ID());
			if(!"T".equals(one.getSfsqks()) || one.getSfsqks() == null) {
				edu005List = new ArrayList<>();
			}
		}

		return edu005List;
	}

	//创建成绩模板
	public XSSFWorkbook creatGradeModel(List<Edu005> edu005List) {
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("已选成绩详情");

		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		// 所有标题数组
		String[] titles = new String[] {"学年","行政班名称","课程名称","学生姓名", "学号","成绩","免修状态"};

		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}

		for (int i = 0; i < edu005List.size(); i++) {
			utils.appendCell(sheet,i,"",edu005List.get(i).getXn(),-1,0,false);
			utils.appendCell(sheet,i,"",edu005List.get(i).getClassName(),-1,1,false);
			utils.appendCell(sheet,i,"",edu005List.get(i).getCourseName(),-1,2,false);
			utils.appendCell(sheet,i,"",edu005List.get(i).getStudentName(),-1,3,false);
			utils.appendCell(sheet,i,"",edu005List.get(i).getStudentCode(),-1,4,false);
			utils.appendCell(sheet,i,"",edu000DAO.queryEjdmMcByEjdmZ(edu005List.get(i).getIsMx(),"IS_MX"),-1,6,false);
		}

		sheet.setColumnWidth(0, 12*256);
		sheet.setColumnWidth(1, 16*256);
		sheet.setColumnWidth(2, 30*256);
		sheet.setColumnWidth(3, 10*256);
		sheet.setColumnWidth(4, 20*256);

		return workbook;
	}

	//查询成绩导出成绩excel
	public List<Edu005> getExportGrade(String classes,String trem,List<String> list) {
		//根据条件筛选成绩表
		List<Edu005> edu005List = edu005Dao.getExportGrade(classes,trem,list);
		return edu005List;
	}

	//导出不及格成绩excel
	public List<Edu0051> exportMakeUpGrade(String trem,String crouses) {
		//根据条件筛选成绩表
		List<Edu0051> edu0051List = edu0051Dao.exportMakeUpGrade(trem,crouses);
		return edu0051List;
	}

    //导出不及格成绩excel模板
    public List<Edu005> exportMakeUpGradeCheckModel(String trem,List<String> crouses,String userId) {
        //根据条件筛选成绩表
		String edu101Id = edu101DAO.queryTeacherIdByUserId(userId);
        List<Edu005> edu005List = edu005Dao.exportMakeUpGradeCheckModel(trem,crouses,edu101Id);
        return edu005List;
    }

    //导出不及格成绩excel模板
    public List<Edu005> exportMakeUpGradeCheckModel(String trem,List<String> crouses,List<String> classes,String userId) {
        //根据条件筛选成绩表
		String edu101Id = edu101DAO.queryTeacherIdByUserId(userId);
        List<Edu005> edu005List = edu005Dao.exportMakeUpGradeCheckModel(trem,crouses,classes,edu101Id);
        return edu005List;
    }

	//查询补考成绩
	public ResultVO getHistoryGrade(String Edu005_Id){
		ResultVO resultVO;
		List<Edu0051> edu0051List = edu0051Dao.getHistoryGrade(Edu005_Id);
		if(edu0051List.size() == 0){
			resultVO = ResultVO.setFailed("暂无数据");
			return resultVO;
		}
		List<Edu0051> edu0051List2 = new ArrayList<>();
		if(edu0051List.get(0).getExam_num()!= 0){
			Edu0051 edu0051 = new Edu0051();
			edu0051.setCourseName(edu0051List.get(0).getCourseName());
			edu0051.setGrade("暂无数据");
			edu0051.setEntryDate("暂无数据");
			edu0051.setExam_num(0);
			edu0051.setGradeEnter("暂无数据");
			edu0051List2.add(edu0051);
		}
		edu0051List2.addAll(edu0051List);
		resultVO = ResultVO.setSuccess("查找成功",edu0051List2);
		return resultVO;
	}

	//溯源数据
	public ResultVO rootsData(){
		ResultVO resultVO;
		List<Edu005> edu005List = edu005Dao.rootsData();
		for(int i = 0;i<edu005List.size();i++){
			Edu005 e = edu005List.get(i);
			Edu0051 edu0051 = new Edu0051();
			edu0051.setEdu005_ID(e.getEdu005_ID());
			edu0051.setEdu001_ID(e.getEdu001_ID());
			edu0051.setEdu201_ID(e.getEdu201_ID());
			edu0051.setEdu300_ID(e.getEdu300_ID());
			edu0051.setEdu101_ID(e.getEdu101_ID());
			edu0051.setCourseName(e.getCourseName());
			edu0051.setClassName(e.getClassName());
			edu0051.setStudentName(e.getStudentName());
			edu0051.setStudentCode(e.getStudentCode());
			edu0051.setGradeEnter(e.getGradeEnter());
			edu0051.setEntryDate(e.getEntryDate());
			edu0051.setGrade(e.getGrade());
			edu0051.setXnid(e.getXnid());
			edu0051.setXn(e.getXn());
			edu0051.setExam_num(0);
			edu0051Dao.save(edu0051);
		}
		resultVO = ResultVO.setSuccess("溯源成功,共"+edu005List.size()+"条数据");
		return resultVO;
	}

	//导出成绩excel
	public XSSFWorkbook exportGrade(List<Edu005> edu005List,int size) {
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("已选成绩详情");

		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		// 所有标题数组
		String[] titles = new String[size+2]; /*{"学年","行政班名称","课程名称","学生姓名", "学号","成绩"}*/
		titles[0] = "学生姓名";
		titles[1] = "学生学号";
		for(int j = 0;j<size;j++){
			titles[j+2] = edu005List.get(j).getCourseName();
		}

		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}

		for (int i = 0; i < edu005List.size()/size; i++) {
			utils.appendCell(sheet,i,"",edu005List.get(i*size).getStudentName(),-1,0,false);
			utils.appendCell(sheet,i,"",edu005List.get(i*size).getStudentCode(),-1,1,false);
			for(int j = 0;j<size;j++){
				if("01".equals(edu005List.get(i*size+j).getIsMx())){
					utils.appendCell(sheet,i,"","免修",-1,j+2,false);
				}else{
					if(edu005List.get(i*size+j).getGrade() != null && !"".equals(edu005List.get(i*size+j).getGrade())){
						if(edu005List.get(i*size+j).getExam_num() == null || edu005List.get(i*size+j).getExam_num() == 0){
							utils.appendCell(sheet,i,"",edu005List.get(i*size+j).getGrade(),-1,j+2,false);
						}else{
							utils.appendCell(sheet,i,"",edu005List.get(i*size+j).getGrade()+"(补考)",-1,j+2,false);
						}
					}else{
						utils.appendCell(sheet,i,"","暂无成绩",-1,j+2,false);
					}
				}
			}
		}

		sheet.setColumnWidth(0, 12*256);
		sheet.setColumnWidth(1, 20*256);
		sheet.setColumnWidth(2, 20*256);
		sheet.setColumnWidth(3, 20*256);
		sheet.setColumnWidth(4, 20*256);
		sheet.setColumnWidth(5, 20*256);

		return workbook;
	}

	//导出成绩excel
	public XSSFWorkbook exportGradeAll(List<Edu005> edu005List,int size) {
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("已选成绩详情");

		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		// 所有标题数组
		String[] titles = new String[size+2]; /*{"学年","行政班名称","课程名称","学生姓名", "学号","成绩"}*/
		titles[0] = "学生姓名";
		titles[1] = "学生学号";
		for(int j = 0;j<size;j++){
			titles[j+2] = edu005List.get(j).getCourseName();
		}

		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}

		for (int i = 0; i < edu005List.size()/size; i++) {
			utils.appendCell(sheet,i,"",edu005List.get(i*size).getStudentName(),-1,0,false);
			utils.appendCell(sheet,i,"",edu005List.get(i*size).getStudentCode(),-1,1,false);
			for(int j = 0;j<size;j++){
				if("01".equals(edu005List.get(i*size+j).getIsMx())){
					utils.appendCell(sheet,i,"","免修",-1,j+2,false);
				}else{
					if(edu005List.get(i*size+j).getGrade() != null && !"".equals(edu005List.get(i*size+j).getGrade())){
						if(edu005List.get(i*size+j).getExam_num() == null || edu005List.get(i*size+j).getExam_num() == 0){
							utils.appendCell(sheet,i,"",edu005List.get(i*size+j).getGrade(),-1,j+2,false);
						}else{
							String muGrade = "(";
							List<Edu0051> edu0051List = edu0051Dao.getHistoryGrade(edu005List.get(i*size+j).getEdu005_ID()+"");
							for (int ii = 0;ii<edu0051List.size();ii++){
								if(ii == 0){
									if(ii == edu0051List.size()-1){
										muGrade = muGrade+"正考成绩："+edu0051List.get(ii).getGrade()+"分";
									}else{
										muGrade = muGrade+"正考成绩："+edu0051List.get(ii).getGrade()+"分,";
									}
								}else{
									if(ii == edu0051List.size()-1){
										muGrade = muGrade+"第"+edu0051List.get(ii).getExam_num()+"次补考成级："+edu0051List.get(ii).getGrade()+"分";
									}else{
										muGrade = muGrade+"第"+edu0051List.get(ii).getExam_num()+"次补考成级："+edu0051List.get(ii).getGrade()+"分,";
									}
								}
							}
							muGrade = muGrade+")";
							utils.appendCell(sheet,i,"",muGrade,-1,j+2,false);
						}
					}else{
						utils.appendCell(sheet,i,"","暂无成绩",-1,j+2,false);
					}
				}
			}
		}

		sheet.setColumnWidth(0, 12*256);
		sheet.setColumnWidth(1, 20*256);
		sheet.setColumnWidth(2, 20*256);
		sheet.setColumnWidth(3, 20*256);
		sheet.setColumnWidth(4, 20*256);
		sheet.setColumnWidth(5, 20*256);

		return workbook;
	}

	//导出不及格成绩excel
	public XSSFWorkbook exportMUGrade(List<Edu0051> edu0051List) {
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("已选成绩详情");

		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		// 所有标题数组
		String[] titles = new String[] {"学年","行政班名称","课程名称","学生姓名", "学号","录入时间","成绩"};

		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}

		for (int i = 0; i < edu0051List.size(); i++) {
			utils.appendCell(sheet,i,"",edu0051List.get(i).getXn(),-1,0,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getClassName(),-1,1,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getCourseName(),-1,2,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getStudentName(),-1,3,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getStudentCode(),-1,4,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getEntryDate(),-1,5,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getGrade(),-1,6,false);
			if(edu0051List.get(i).getExam_num() == 0){
				utils.appendCell(sheet,i,"","正考成绩",-1,7,false);
			}else{
				utils.appendCell(sheet,i,"","第"+edu0051List.get(i).getExam_num()+"次补考成绩",-1,7,false);
			}
		}

		sheet.setColumnWidth(0, 12*256);
		sheet.setColumnWidth(1, 16*256);
		sheet.setColumnWidth(2, 30*256);
		sheet.setColumnWidth(3, 10*256);
		sheet.setColumnWidth(4, 20*256);
		sheet.setColumnWidth(5, 30*256);
		sheet.setColumnWidth(7, 20*256);

		return workbook;
	}

	//导出不及格成绩excel
	public XSSFWorkbook exportMUGradeModel(List<Edu005> edu0051List) {
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("已选成绩详情");

		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		// 所有标题数组
		String[] titles = new String[] {"学年","行政班名称","课程名称","学生姓名", "学号","成绩"};

		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}

		for (int i = 0; i < edu0051List.size(); i++) {
			utils.appendCell(sheet,i,"",edu0051List.get(i).getXn(),-1,0,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getClassName(),-1,1,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getCourseName(),-1,2,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getStudentName(),-1,3,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getStudentCode(),-1,4,false);
			utils.appendCell(sheet,i,"",edu0051List.get(i).getIsExamCrouse(),-1,6,false);

//			utils.appendCell(sheet,i,"",edu0051List.get(i).getGrade(),-1,6,false);
//			if(edu0051List.get(i).getExam_num() == 0){
//				utils.appendCell(sheet,i,"","正考成绩",-1,7,false);
//			}else{
//				utils.appendCell(sheet,i,"","第"+edu0051List.get(i).getExam_num()+"次补考成绩",-1,7,false);
//			}
		}

		sheet.setColumnWidth(0, 12*256);
		sheet.setColumnWidth(1, 16*256);
		sheet.setColumnWidth(2, 30*256);
		sheet.setColumnWidth(3, 10*256);
		sheet.setColumnWidth(4, 20*256);
		sheet.setColumnHidden((short)6, true);
		return workbook;
	}

	//校验导入成绩文件
	public ResultVO checkGradeFile(MultipartFile file) {
		ResultVO resultVO;
		String fileName = file.getOriginalFilename();
		String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
		if (!"xlsx".equals(suffix) && !"xls".equals(suffix)) {
			resultVO = ResultVO.setFailed("文件格式错误");
			return resultVO;
		}
		try {
			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheet("已选成绩详情");
			XSSFRow firstRow = sheet.getRow(1);
			String xn = firstRow.getCell(0).toString();
			String className = firstRow.getCell(1).toString();
			String courseName = firstRow.getCell(2).toString();


			Specification<Edu005> edu005Specification = new Specification<Edu005>() {
				public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
					List<Predicate> predicates = new ArrayList<Predicate>();
					predicates.add(cb.equal(root.<String>get("courseName"),courseName));
					predicates.add(cb.equal(root.<String>get("xn"),xn));
					predicates.add(cb.equal(root.<String>get("className"),className));
					predicates.add(cb.equal(root.<String>get("isExamCrouse"),"T"));
					predicates.add(cb.isNull(root.<String>get("isConfirm")));
					return cb.and(predicates.toArray(new Predicate[predicates.size()]));
				}
			};

			List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

			if (edu005List.size() == 0 ) {
				resultVO = ResultVO.setFailed("该课程成绩已确认，无法导入");
				return resultVO;
			}


			int totalRows = sheet.getPhysicalNumberOfRows() - 1;
			// 遍历集合数据，产生数据行
			for (int i = 0; i < totalRows; i++) {
				int rowIndex = i + 1;
				XSSFRow contentRow = sheet.getRow(rowIndex);
				XSSFCell cell0 = contentRow.getCell(0);
				XSSFCell cell1 = contentRow.getCell(1);
				XSSFCell cell2 = contentRow.getCell(2);
				XSSFCell cell3 = contentRow.getCell(3);
				XSSFCell cell4 = contentRow.getCell(4);
				if (cell0 == null || cell1 == null || cell2 == null || cell3 == null || cell4 == null) {
					resultVO = ResultVO.setFailed("第"+rowIndex+"行存在空值");
					return resultVO;
				}
				XSSFCell cell6 = contentRow.getCell(6);
				if (cell6 != null && !"正常".equals(cell6.toString())){
					continue;
				}
				XSSFCell cell = contentRow.getCell(5);
				if(cell != null) {
					String data = cell.toString();
					Boolean isNum = true;//data是否为数值型
					if (data != null || "".equals(data)) {
						//判断data是否为数值型
						isNum = data.matches("^(-?\\d+)(\\.\\d+)?$");
					}
					if(!isNum) {
						resultVO = ResultVO.setFailed("第"+rowIndex+"行成绩不是数字");
						return resultVO;
					}
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

		resultVO = ResultVO.setSuccess("格式校验成功");
		return resultVO;
	}


	//校验导入补考成绩文件
	public ResultVO checkGradeFileMakeUp(MultipartFile file,String userKey) {
		ResultVO resultVO;
		String fileName = file.getOriginalFilename();
		String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
		if (!"xlsx".equals(suffix) && !"xls".equals(suffix)) {
			resultVO = ResultVO.setFailed("文件格式错误");
			return resultVO;
		}
		try {
			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheet("已选成绩详情");
//			XSSFRow firstRow = sheet.getRow(1);
//			String xn = firstRow.getCell(0).toString();
//			String className = firstRow.getCell(1).toString();
//			String courseName = firstRow.getCell(2).toString();



			int totalRows = sheet.getPhysicalNumberOfRows() - 1;
			// 遍历集合数据，产生数据行
			for (int i = 0; i < totalRows; i++) {
				int rowIndex = i + 1;
				XSSFRow contentRow = sheet.getRow(rowIndex);
				XSSFCell cell0 = contentRow.getCell(0);
				XSSFCell cell1 = contentRow.getCell(1);
				XSSFCell cell2 = contentRow.getCell(2);
				XSSFCell cell3 = contentRow.getCell(3);
				XSSFCell cell4 = contentRow.getCell(4);
				if (cell0 == null || cell1 == null || cell2 == null || cell3 == null || cell4 == null) {
					resultVO = ResultVO.setFailed("第"+rowIndex+"行存在空值");
					return resultVO;
				}else{
					String xn = contentRow.getCell(0).toString();
					String className = contentRow.getCell(1).toString();
					String courseName = contentRow.getCell(2).toString();
					String studentCode = contentRow.getCell(4).toString();
					Edu005 edu005 = edu005Dao.findOneBySearchInfo2(xn,className,courseName,studentCode,userKey);
					if(edu005 == null){
						resultVO = ResultVO.setFailed("第"+rowIndex+"行您不是该课程的任课教课");
						return resultVO;
					}else{
						Edu404 edu404 = edu404Dao.findbyxnid2(edu005.getXnid());
						if (edu404 == null){
							resultVO = ResultVO.setFailed("补考录入时间未开启!");
							return resultVO;
						}
						if ("1".equals(edu404.getStatus())){
							resultVO = ResultVO.setFailed("补考录入时间已截止!");
							return resultVO;
						}
					}
				}
				XSSFCell cell6 = contentRow.getCell(6);
				XSSFCell cell = contentRow.getCell(5);
				if(cell != null) {
					String data = cell.toString();
					Boolean isNum = true;//data是否为数值型
					if (data != null || "".equals(data)) {
						//判断data是否为数值型
						if("F".equals(cell6) && !"通过".equals(data) && !"不通过".equals(data)){
							resultVO = ResultVO.setFailed("第"+rowIndex+"行成绩只能为通过或不通过");
							return resultVO;
						}else{
							isNum = data.matches("^(-?\\d+)(\\.\\d+)?$");
						}
					}
					if(!isNum) {
						resultVO = ResultVO.setFailed("第"+rowIndex+"行成绩不是数字");
						return resultVO;
					}
				}
			}

		} catch (IOException e) {
			e.printStackTrace();
		}

		resultVO = ResultVO.setSuccess("格式校验成功");
		return resultVO;
	}

	//批量导入补考成绩
	public ResultVO importGradeFileMakeUp(MultipartFile file, String lrrmc, String userKey) {
		ResultVO resultVO;
		List<Edu005> edu005List = new ArrayList<>();
		try {
			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheet("已选成绩详情");
			int totalRows = sheet.getPhysicalNumberOfRows() - 1;

			// 遍历集合数据，产生数据行
			for (int i = 0; i < totalRows; i++) {
				int rowIndex = i + 1;
				XSSFRow contentRow = sheet.getRow(rowIndex);
				String xn = contentRow.getCell(0).toString();
				String className = contentRow.getCell(1).toString();
				String courseName = contentRow.getCell(2).toString();
				String studentCode = contentRow.getCell(4).toString();
				XSSFCell gradeCell = contentRow.getCell(5);
//				XSSFCell mxzt = contentRow.getCell(6);
//				String mx = edu000DAO.queryEjdmByEjdmZ(mxzt.toString(),"IS_MX");
				if (gradeCell != null) {
					Edu005 edu005;
					edu005 = edu005Dao.findOneBySearchInfo2(xn,className,courseName,studentCode,userKey);
					if (edu005 != null) {
						if(gradeCell != null){
							if("01".equals(edu005.getIsMx()) || Double.parseDouble(edu005.getGrade()) >= 60.00){
								continue;
							}
							if("通过".equals(gradeCell.toString())){
								edu005.setGrade("T");
							}else if("不通过".equals(gradeCell.toString())){
								edu005.setGrade("F");
							}else{
								edu005.setGrade(gradeCell.toString());
							}
//							staffManageService.giveGrade(edu005);
							edu005List.add(edu005);
						}
					}else{
						resultVO = ResultVO.setFailed("第"+(i+1)+"行您不是该课程的任课教课");
						return resultVO;
					}
				}
			}
			for(int i = 0;i<edu005List.size();i++){
				staffManageService.giveGrade(edu005List.get(i));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		resultVO = ResultVO.setSuccess("共导入了"+edu005List.size()+"条成绩信息",edu005List);
		return resultVO;
	}

	//批量导入成绩
	public ResultVO importGradeFile(MultipartFile file, String lrrmc, String userKey) {
		ResultVO resultVO;
		List<Edu005> edu005List = new ArrayList<>();
		try {
			XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
			XSSFSheet sheet = workbook.getSheet("已选成绩详情");
			int totalRows = sheet.getPhysicalNumberOfRows() - 1;

			XSSFRow firstRow = sheet.getRow(1);
			String checkXn = firstRow.getCell(0).toString();
			String checkClassName = firstRow.getCell(1).toString();
			String checkCourseName = firstRow.getCell(2).toString();

			Specification<Edu005> edu005Specification = new Specification<Edu005>() {
				public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
					List<Predicate> predicates = new ArrayList<Predicate>();
					predicates.add(cb.equal(root.<String>get("courseName"),checkCourseName));
					predicates.add(cb.equal(root.<String>get("xn"),checkXn));
					predicates.add(cb.equal(root.<String>get("className"),checkClassName));
					predicates.add(cb.equal(root.<String>get("isExamCrouse"),"T"));
					predicates.add(cb.isNull(root.<String>get("isConfirm")));
					return cb.and(predicates.toArray(new Predicate[predicates.size()]));
				}
			};

			List<Edu005> checkList = edu005Dao.findAll(edu005Specification);

			if(checkList.size() != 0) {
				Long edu201_id = checkList.get(0).getEdu201_ID();
				Edu205 edu205 = edu205Dao.findExist(userKey,edu201_id);

				if (edu205 == null) {
					resultVO = ResultVO.setFailed("您不是该课程的老师无法导入成绩");
					return resultVO;
				}
			}

			// 遍历集合数据，产生数据行
			for (int i = 0; i < totalRows; i++) {
				int rowIndex = i + 1;
				XSSFRow contentRow = sheet.getRow(rowIndex);
				String xn = contentRow.getCell(0).toString();
				String className = contentRow.getCell(1).toString();
				String courseName = contentRow.getCell(2).toString();
				String studentCode = contentRow.getCell(4).toString();
				XSSFCell gradeCell = contentRow.getCell(5);
				XSSFCell mxzt = contentRow.getCell(6);
				String mx = edu000DAO.queryEjdmByEjdmZ(mxzt.toString(),"IS_MX");
				if (gradeCell != null || mx != null ) {
					Edu005 edu005;
					edu005 = edu005Dao.findOneBySearchInfo(xn,className,courseName,studentCode);
					if (edu005 != null) {
						if(mx != null){
							edu005.setIsMx(mx);
							if(gradeCell == null && "0".equals(mx)){
								continue;
							}else if(gradeCell != null && "0".equals(mx)){
								edu005.setGrade(gradeCell.toString());
							}
							edu005.setEdu101_ID(Long.parseLong(userKey));
							edu005.setGradeEnter(lrrmc);
							staffManageService.giveGrade(edu005);
							edu005List.add(edu005);
						}else if(gradeCell != null){
							edu005.setGrade(gradeCell.toString());
							edu005.setEdu101_ID(Long.parseLong(userKey));
							edu005.setGradeEnter(lrrmc);
							staffManageService.giveGrade(edu005);
							edu005List.add(edu005);
						}
					}
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		resultVO = ResultVO.setSuccess("共导入了"+edu005List.size()+"条成绩信息",edu005List);
		return resultVO;
	}

	//考勤录入查询
	public ResultVO searchCourseCheckOn(CourseCheckOnPO searchInfoPO) {
		ResultVO resultVO;
		//根据条件筛选考情考情情况录入
		Specification<CourseCheckOnPO> specification = new Specification<CourseCheckOnPO>() {
			public Predicate toPredicate(Root<CourseCheckOnPO> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (searchInfoPO.getXnid() != null && !"".equals(searchInfoPO.getXnid())) {
					predicates.add(cb.equal(root.<String>get("xnid"), searchInfoPO.getXnid()));
				}
				if (searchInfoPO.getWeek() != null && !"".equals(searchInfoPO.getWeek())) {
					predicates.add(cb.equal(root.<String>get("week"), searchInfoPO.getWeek()));
				}
				if (searchInfoPO.getXqid() != null && !"".equals(searchInfoPO.getXqid())) {
					predicates.add(cb.equal(root.<String>get("xqid"), searchInfoPO.getXqid()));
				}
				if (searchInfoPO.getKcmc() != null && !"".equals(searchInfoPO.getKcmc())) {
					predicates.add(cb.equal(root.<String>get("kcmc"), searchInfoPO.getKcmc()));
				}
				if (searchInfoPO.getEdu101_id() != null && !"".equals(searchInfoPO.getEdu101_id())) {
					predicates.add(cb.equal(root.<String>get("edu101_id"), searchInfoPO.getEdu101_id()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};

		List<CourseCheckOnPO> checkOnDaoAll = courseCheckOnDao.findAll(specification);

		if (checkOnDaoAll.size() != 0) {
			resultVO = ResultVO.setSuccess("共找到"+checkOnDaoAll.size()+"个课节",checkOnDaoAll);
		} else {
			resultVO = ResultVO.setFailed("未找到您的课节");
		}

		return resultVO;
	}

	//任务书查询行政班
	public ResultVO taskSearchAdministrativeClass(Edu300 edu300) {
		ResultVO resultVO;
		Specification<Edu300> specification = new Specification<Edu300>() {
			public Predicate toPredicate(Root<Edu300> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (edu300.getXzbmc() != null && !"".equals(edu300.getXzbmc())) {
					predicates.add(cb.like(root.<String>get("xzbmc"), "%"+edu300.getXzbmc()+"%"));
				}
				if (edu300.getNjbm() != null && !"".equals(edu300.getNjbm())) {
					predicates.add(cb.equal(root.<String>get("njbm"), edu300.getNjbm()));
				}
				if (edu300.getBatch() != null && !"".equals(edu300.getBatch())) {
					predicates.add(cb.equal(root.<String>get("batch"), edu300.getBatch()));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu300> edu300List = edu300DAO.findAll(specification);

		if (edu300List.size() != 0) {
			resultVO = ResultVO.setSuccess("共找到"+edu300List.size()+"个行政班",edu300List);
		} else {
			resultVO = ResultVO.setFailed("未找到符合要求的行政班");
		}

		return resultVO;
	}

	//任务书查询教学班
	public ResultVO taskSearchTeachingClass(String teachingClassName) {
		ResultVO resultVO;
		Specification<Edu301> specification = new Specification<Edu301>() {
			public Predicate toPredicate(Root<Edu301> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
				List<Predicate> predicates = new ArrayList<Predicate>();
				if (teachingClassName != null && !"".equals(teachingClassName)) {
					predicates.add(cb.like(root.<String>get("jxbmc"), "%"+teachingClassName+"%"));
				}
				return cb.and(predicates.toArray(new Predicate[predicates.size()]));
			}
		};
		List<Edu301> edu301List = edu301DAO.findAll(specification);

		if (edu301List.size() != 0) {
			resultVO = ResultVO.setSuccess("共找到"+edu301List.size()+"个教学班",edu301List);
		} else {
			resultVO = ResultVO.setFailed("未找到符合要求的教学班");
		}

		return resultVO;
	}


	//学生转班级
	public ResultVO changeStudentClass(Edu001 oldEdu001,Edu001 newEdu001) {
		ResultVO resultVO;
		//修改用户名
		edu990Dao.changeYhmByStudentXh(oldEdu001.getXh(),newEdu001.getXh());
		//删除成绩表信息
		edu005Dao.deleteByEdu001Id(oldEdu001.getEdu001_ID());
		//查询需要生成成绩单的任务书
		List<Edu201> edu201List = edu201DAO.findTaskWithNewClass(newEdu001.getEdu300_ID());
		//生成成绩单
		if(edu201List.size() != 0) {
			for (Edu201 edu201 : edu201List) {
				Edu005 edu005 = new Edu005();
				edu005.setEdu001_ID(oldEdu001.getEdu001_ID());
				edu005.setEdu201_ID(edu201.getEdu201_ID());
				edu005.setEdu300_ID(Long.parseLong(newEdu001.getEdu300_ID()));
				edu005.setCourseName(edu201.getKcmc());
				edu005.setClassName(newEdu001.getXzbname());
				edu005.setStudentName(oldEdu001.getXm());
				edu005.setStudentCode(newEdu001.getXh());
				edu005.setIsExamCrouse(edu201.getSfxylcj());
				edu005.setCredit(edu201.getXf());
				edu005.setXnid(edu201.getXnid());
				edu005.setXn(edu201.getXn());
				edu005Dao.save(edu005);
			}
		}

		//更新学生信息
		oldEdu001.setPycc(newEdu001.getPycc());
		oldEdu001.setPyccmc(newEdu001.getPyccmc());
		oldEdu001.setSzxb(newEdu001.getSzxb());
		oldEdu001.setSzxbmc(newEdu001.getSzxb());
		oldEdu001.setNj(newEdu001.getNj());
		oldEdu001.setNjmc(newEdu001.getNjmc());
		oldEdu001.setZybm(newEdu001.getZybm());
		oldEdu001.setZymc(newEdu001.getZymc());
		oldEdu001.setEdu300_ID(newEdu001.getEdu300_ID());
		oldEdu001.setXzbname(newEdu001.getXzbname());
		oldEdu001.setXh(newEdu001.getXh());
		edu001DAO.save(oldEdu001);

		resultVO = ResultVO.setSuccess("操作成功");

		return resultVO;
	}


	//查询公众号权限
	public ResultVO selectGzhAuthority() {
		ResultVO resultVO;
		List<Edu995> edu995List = edu995Dao.findAll();

		if (edu995List.size() != 0) {
			resultVO = ResultVO.setSuccess("共找到"+edu995List.size()+"条权限信息",edu995List);
		} else {
			resultVO = ResultVO.setFailed("未找到符合要求的教学班");
		}

		return resultVO;
	}

	//修改公众号权限
	public ResultVO updateGzhAuthority(Edu995 edu995) {
		ResultVO resultVO;
		edu995Dao.save(edu995);
		resultVO = ResultVO.setSuccess("修改成功");
		return resultVO;
	}

	//新增日志
	public void addLog(String user_ID,int actionKey,int bussinsneType,String bussinsneinfo,String operationalInfo){
		Edu996 edu996 = new Edu996();
		//用户id
		edu996.setUser_ID(user_ID);
		Edu990 edu990 = edu990Dao.findOne(Long.parseLong(user_ID));
		//用户姓名
		edu996.setUser_name(edu990.getPersonName());
		//操作参数
		edu996.setActionKey(actionKey);
		String actionValue = utils.getActionValue(actionKey);
		//操作名称
		edu996.setActionValue(actionValue);
		//业务类型
		edu996.setBussinsneType(bussinsneType);
		String bussinsneValue = utils.getBussinsneValue(bussinsneType);
		//业务类型
		edu996.setBussinsneValue(bussinsneValue);
		//业务信息
		edu996.setBussinsneinfo(bussinsneinfo);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		//访问时间
		edu996.setTime(df.format(new Date()));
		edu996.setOperationalInfo(operationalInfo);
		edu996Dao.save(edu996);
	}

}
