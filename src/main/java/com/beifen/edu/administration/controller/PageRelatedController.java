package com.beifen.edu.administration.controller;


import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/*
 * 页面映射Controller
 * */
@Controller
public class PageRelatedController {
	/*
	 * 配置默认端口访问页面
	 */
	@Configuration
	public class htmlController extends WebMvcConfigurerAdapter {
		@Override
		public void addViewControllers(ViewControllerRegistry registry) {
			registry.addViewController("/").setViewName("forward:/login.html");
			registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
			super.addViewControllers(registry);
		}
	}
	
	@RequestMapping("register")
	public String registerPage() {
		return "register";
	}
	
	@RequestMapping("main")
	public String mainPage() {
		return "main";
	}

	@RequestMapping("left")
	public String leftPage() {
		return "left";
	}

	@RequestMapping("index")
	public String indexPage() {
		return "index";
	}

	@RequestMapping("top")
	public String topPage() {
		return "top";
	}

	@RequestMapping("accountSetup")
	public String accountSetupPage() {
		return "accountSetup";
	}
	
	@RequestMapping("teacherBaseInfo")
	public String teacherBaseInfoPage() {
		return "teacherBaseInfo";
	}
	
	@RequestMapping("officeClassesSchedule")
	public String officeClassesSchedulePage() {
		return "officeClassesSchedule";
	}
	
	@RequestMapping("officeTeaching")
	public String officeTeachingPage() {
		return "officeTeaching";
	}
	
	@RequestMapping("taskApproval")
	public String taskApprovalPage() {
		return "taskApproval";
	}

	@RequestMapping("addUser")
	public String addUserPage() {
		return "addUser";
	}
	
	@RequestMapping("classManger")
	public String classMangerPage() {
		return "classManger";
	}

	@RequestMapping("culturePlan")
	public String culturePlanPage() {
		return "culturePlan";
	}

	@RequestMapping("LargeScreen")
	public String LargeScreenPage() {
		return "LargeScreen";
	}

	@RequestMapping("noticeHTMLmodel")
	public String noticeHTMLmodelPage() {
		return "noticeHTMLmodel";
	}

	@RequestMapping("releaseNews")
	public String releaseNewsPage() {
		return "releaseNews";
	}

	@RequestMapping("approvalManger")
	public String approvalMangerPage() {
		return "approvalManger";
	}

	@RequestMapping("approvalQuery")
	public String approvalQueryPage() {
		return "approvalQuery";
	}

	@RequestMapping("roleManger")
	public String roleMangerPage() {
		return "roleManger";
	}

	@RequestMapping("scheduleClasses")
	public String scheduleClassesPage() {
		return "scheduleClasses";
	}

	@RequestMapping("studentInfo")
	public String studentInfoPage() {
		return "studentInfo";
	}
	
	@RequestMapping("courseLibraryapproval")
	public String courseLibraryapprovalPage() {
		return "courseLibraryapproval";
	}

	@RequestMapping("teacherSemestersSchedule")
	public String teacherSemestersSchedulePage() {
		return "teacherSemestersSchedule";
	}
	
	@RequestMapping("culturePlanapproval")
	public String culturePlanapprovalPage() {
		return "culturePlanapproval";
	}
	
	@RequestMapping("publiCode")
	public String publiCodePage() {
		return "publiCode";
	}
	
	@RequestMapping("courseLibrary")
	public String courseLibraryPage() {
		return "courseLibrary";
	}
	
	@RequestMapping("localInfo")
	public String localInfoPage() {
		return "localInfo";
	}

	@RequestMapping("localUseFrequency")
	public String localUsedPage() {
		return "localUseFrequency";
	}

	@RequestMapping("businessApproval")
	public String businessApprovalPage() {
		return "businessApproval";
	}

	@RequestMapping("studentClass")
	public String studentClassPage() {
		return "studentClass";
	}

	@RequestMapping("techerStudentList")
	public String techerStudentListPage() {
		return "techerStudentList";
	}

	@RequestMapping("teacherClassChange")
	public String teacherClassChangePage() {
		return "teacherClassChange";
	}

	@RequestMapping("ackExam")
	public String ackExamackExamPage() {
		return "ackExam";
	}

	@RequestMapping("localPointInfo")
	public String localPointInfoPage() {
		return "localPointInfo";
	}

	@RequestMapping("gradeEntry")
	public String gradeEntryPage() {
		return "gradeEntry";
	}

	@RequestMapping("gradeQuery")
	public String gradeQueryPage() {
		return "gradeQuery";
	}

	@RequestMapping("performance")
	public String performancePage() {
		return "performance";
	}

	@RequestMapping("studentBreak")
	public String studentBreakPage() {
		return "studentBreak";
	}

	@RequestMapping("appraisals")
	public String appraisalsPage() {
		return "appraisals";
	}

	@RequestMapping("localAssets")
	public String localAssetsPage() {
		return "localAssets";
	}

	@RequestMapping("localPointAssets")
	public String localPointAssetsPage() {
		return "localPointAssets";
	}

	@RequestMapping("leaderLog")
	public String leaderLogPage() {
		return "leaderLog";
	}

	@RequestMapping("SecondaryCodeManagement")
	public String SecondaryCodeManagementPage() {
		return "SecondaryCodeManagement";
	}

	@RequestMapping("allSchedule")
	public String allSchedulePage() {
		return "allSchedule";
	}

	@RequestMapping("dataPrediction")
	public String dataPredictionPage() {
		return "dataPrediction";
	}

	@RequestMapping("chartDemo")
	public String chartDemoPage() {
		return "chartDemo";
	}

	@RequestMapping("dataExcavating")
	public String dataExcavatingPage() {
		return "dataExcavating";
	}

	@RequestMapping("teachDatasConfiguration")
	public String teachDatasConfigurationPage() {
		return "teachDatasConfiguration";
	}

	@RequestMapping("crouseRsQuery")
	public String crouseRsQueryPage() {
		return "crouseRsQuery";
	}

	@RequestMapping("checkOnEntry")
	public String checkOnEntryPage() {
		return "checkOnEntry";
	}

	@RequestMapping("gradeQueryForMangers")
	public String gradeQueryForMangersPage() {
		return "gradeQueryForMangers";
	}
}
