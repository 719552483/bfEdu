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

	@RequestMapping("releaseNews")
	public String releaseNewsPage() {
		return "releaseNews";
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
}
