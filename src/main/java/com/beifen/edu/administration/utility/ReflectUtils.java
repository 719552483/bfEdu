package com.beifen.edu.administration.utility;


import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;


import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu103;
import com.beifen.edu.administration.domian.Edu104;
import com.beifen.edu.administration.domian.Edu105;
import com.beifen.edu.administration.domian.Edu106;
import com.beifen.edu.administration.domian.Edu107;
import com.beifen.edu.administration.domian.Edu300;
import com.beifen.edu.administration.service.AdministrationPageService;

import net.sf.json.JSONObject;


@Component
public class ReflectUtils {
	// 缓存类的字段
	private static Map<String, List<Field>> cache = new HashMap<>();
	 @Resource
	private AdministrationPageService administrationPageService;
	
	private static ReflectUtils reflectUtils;
	 @PostConstruct
	    public void init() {
		 reflectUtils = this;
		 reflectUtils.administrationPageService = this.administrationPageService;
	    }
	
	public static Map<String, Object> createMapForNotNull(Object bean) {
		List<Field> fields = listAllFields(bean.getClass());
		try {
			Map<String, Object> map = new HashMap<>();
			if (fields != null) {
				for (Field field : fields) {
					Object value = field.get(bean);
					if (value != null) {
						String name = field.getName();
						map.put(name, value);
					}
				}
			}
			return map;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public static void reflectMapToBean(Map<String, Object> map, Object bean) {
		Class clazz = bean.getClass();
		try {
			List<Field> fields = listAllFields(clazz);
			if (fields != null) {
				for (Field field : fields) {
					String name = field.getName();
					Object value = map.get(name);
					Class type = field.getType();
					if (value.getClass().equals(type)) {
						field.set(bean, value);
					}
				}
			}
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 浅层次将对象转变为map
	 * 
	 * @param bean
	 * @return
	 */
	public static Map<String, Object> simpleReflectBeanToMap(Object bean) throws Exception {
		List<Field> fields = listAllFields(bean.getClass());
		if (fields == null || fields.size() == 0)
			return null;
		Map<String, Object> map = new HashMap<>();
		for (Field field : fields) {
			String name = field.getName();
			Object value = field.get(bean);
			if (isEmpty(value))
				continue;
			map.put(name, value);
		}
		return map;
	}

	/**
	 * 深层次将对象转变为Map递归下去
	 *
	 * @param bean
	 * @return
	 * @throws Exception
	 */
	public static Map<String, Object> reflectBeanToMap(Object bean) throws Exception {
		List<Field> fields = listAllFields(bean.getClass());
		if (fields == null || fields.size() == 0)
			return null;
		Map<String, Object> map = new HashMap<>();
		for (Field field : fields) {
			String name = field.getName();
			Object value = field.get(bean);
			if (isEmpty(value))
				continue;
			if (isSimpleType(field.getType())) {// 如果为基本类型
				map.put(name, value);
			} else {
				Map<String, Object> tempMap = reflectBeanToMap(value);
				map.put(name, tempMap);
			}
		}
		return map;
	}

	/**
	 * 是否为null1
	 *
	 * @param value
	 * @return
	 */
	public static boolean isEmpty(Object value) {
		if (value == null)
			return true;
		return false;
	}

	/**
	 * 是否为基本类型
	 *
	 * @param clazz
	 * @return
	 */
	public static boolean isSimpleType(Class clazz) {
		if (clazz.equals(int.class) || clazz.equals(Integer.class))
			return true;
		if (clazz.equals(String.class))
			return true;
		if (clazz.equals(long.class) || clazz.equals(Long.class))
			return true;
		if (clazz.equals(float.class) || clazz.equals(Float.class))
			return true;
		if (clazz.equals(double.class) || clazz.equals(Double.class))
			return true;
		if (clazz.equals(short.class) || clazz.equals(Short.class))
			return true;
		if (clazz.equals(char.class) || clazz.equals(Character.class))
			return true;
		if (clazz.equals(boolean.class) || clazz.equals(Boolean.class))
			return true;
		if (clazz.equals(byte.class) || clazz.equals(Byte.class))
			return true;
		return false;

	}

	/**
	 * 列出该类及其子类下面所以得非静态字段
	 *
	 * @param clazz
	 * @return
	 */
	public static List<Field> listAllFields(Class clazz) {
		List<Field> result = cache.get(clazz.getName());
		if (result != null)
			return result;
		Field[] fields = clazz.getDeclaredFields();
		if (fields == null || fields.length == 0)
			return null;
		result = new LinkedList<>();
		for (Field field : fields) {
			if (Modifier.isStatic(field.getModifiers()))
				continue;
			field.setAccessible(true);
			result.add(field);
		}
		if (clazz.getSuperclass() != null) {
			List<Field> temps = listAllFields(clazz.getSuperclass());
			if (temps != null)
				result.addAll(temps);
		}
		cache.put(clazz.getName(), result);
		return result;
	}

	/**
	 * 将简单的map映射成bean对象
	 * 
	 * @param data
	 * @param clazz
	 * @return
	 * @throws Exception
	 */
	public static <T> T simpleChangeMapToBean(Map<String, Object> data, Class clazz) throws Exception {
		List<Field> fields = listAllFields(clazz);
		T bean = (T) clazz.newInstance();
		if (fields != null && fields.size() > 0) {
			for (Field field : fields) {
				String name = field.getName();
				Object value = data.get(name);
				if (isEmpty(value))
					continue;
				field.set(bean, value);
			}
		}
		return bean;
	}

	/**
	 * 深层次将map中的数据映射到bean中递归下去
	 * 
	 * @param data
	 * @param clazz
	 * @return
	 * @throws Exception
	 */
	public static <T> T changeMapToBean(Map<String, Object> data, Class clazz) throws Exception {
		List<Field> fields = listAllFields(clazz);
		T bean = (T) clazz.newInstance();
		if (fields != null && fields.size() > 0) {
			for (Field field : fields) {
				String name = field.getName();
				Object value = data.get(name);
				if (isEmpty(value))
					continue;
				if (isSimpleType(field.getType())) {
					field.set(bean, value);
				} else {
					Map<String, Object> tempMap = (Map<String, Object>) value;
					Object resultValue = changeMapToBean(tempMap, field.getType());
					field.set(bean, resultValue);
				}
			}
		}
		return bean;
	}

	public <T> Object listToObj(Object obj) {

		Field[] field = obj.getClass().getDeclaredFields();

		return null;

	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * 检验文件
	 * @param suffix文件后缀名
	 * @return checkPass 验证结果
	 * @throws Exception 
	 * @throws java.text.ParseException 
	 * */
	public Map<String, Object> checkFile(MultipartFile file,String checkType,String hopeSheetName) throws java.text.ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		boolean isExcel=false;
		boolean sheetCountPass=false;
		boolean modalPass=false;
		boolean haveData=false;
		
		// 判断读取的文件是否为Excel文件
		String fileName = file.getOriginalFilename();
		String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
		if ("xlsx".equals(suffix) || "xls".equals(suffix)) {
			isExcel = true;
		}
		
		if(isExcel){
			//获取Excel工作簿
			InputStream in=file.getInputStream();
			Workbook workBook = WorkbookFactory.create(in);
			int sheetCount = workBook.getNumberOfSheets();// 获取sheet个数
			
			//验证sheet个数
			if(sheetCount > 0){
				sheetCountPass=true;
			}
			
			//验证sheet名字
			String sheetName = workBook.getSheetAt(0).getSheetName();//sheet名称
			if (sheetCountPass&&checkType.equals("ImportEdu001")&&sheetName.equals(hopeSheetName)) {
				modalPass=true;
			}
			
			//验证是否有数据
			List<Map<String,Object>> importStudents = this.getImportData(file.getInputStream(),checkType);
			if(sheetCountPass&&modalPass&&importStudents.size()>0){
				haveData=true;
			}
			
			//验证数据正确性
			if(sheetCountPass&&modalPass&&haveData){
				if(checkType.equals("edu001")){
					Map<String, Object> datacheckInfo=this.checkImportStudentInfo(importStudents);
					returnMap.put("dataCheck", datacheckInfo.get("chaeckPass"));
					returnMap.put("checkTxt", datacheckInfo.get("checkTxt"));
					returnMap.put("importStudent", datacheckInfo.get("importStudent"));
				}
			}
		}
		
		returnMap.put("isExcel",isExcel);
		returnMap.put("sheetCountPass",sheetCountPass);
		returnMap.put("modalPass",modalPass);
		returnMap.put("haveData",haveData);
		return returnMap;
	}


	/**
	 * 验证导入的学生数据
	 * @throws Exception 
	 * @throws java.text.ParseException 
	 * */
	private Map<String, Object> checkImportStudentInfo(List<Map<String, Object>> importStudentsMap) throws java.text.ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		List<Edu001> importStudent=new ArrayList<Edu001>();
		boolean chaeckPass=true;
		String checkTxt="";
		
		//组装上传学生对象
		for (int i = 0; i < importStudentsMap.size(); i++) {
			Edu001 edu001 = JSON.parseObject(JSON.toJSONString(importStudentsMap.get(i)), Edu001.class); // mapToBean
			if (edu001.getCsrq() != null) {
				int Age = getAge(parse((String) importStudentsMap.get(i).get("csrq")));
				if (Age <= 0) {
					chaeckPass = false;
					checkTxt = "第" + (i + 1) + "行-出生日期异常";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					return returnMap;
				}
				edu001.setNl(String.valueOf(Age));
			}
			importStudent.add(edu001);
		}
		
		List<Edu103> pcyys=null;
		List<Edu104> xbs=null;
		List<Edu105> njs=null;
		List<Edu106> zys=null;
		List<Edu300> xzbs=null;
		List<Edu000> ztbms =null;
		List<Edu000> mzs =null;
		List<Edu000> zzmms=null;
		List<Edu000> whcds=null;
		List<Edu000> zsfss=null;
		allforOver:
		for (int i = 0; i < importStudent.size(); i++) {
			Edu001 edu001 = importStudent.get(i);
			//非空验证
			if(isNull(edu001.getXh())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-学号不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", "第"+(i+1)+"行-学号不能为空");
				break;
			}
			if(isNull(edu001.getXm())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-学生姓名不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getXb())){
				chaeckPass=false;
				checkTxt= "第"+(i+1)+"行-性别不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt",checkTxt);
				break;
			}
			if(isNull(edu001.getZtCode())){
				chaeckPass=false;
				checkTxt= "第"+(i+1)+"行-学生状态不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt",checkTxt);
				break;
			}
			if(isNull(edu001.getCsrq())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-出生日期不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getPycc())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-培养层次编码不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getSzxb())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-系部编码不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt",checkTxt );
				break;
			}
			if(isNull(edu001.getNj())){
				chaeckPass=false;
				checkTxt= "第"+(i+1)+"行-年级编码不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt",checkTxt);
				break;
			}
			if(isNull(edu001.getZybm())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-专业编码不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt",checkTxt);
				break;
			}
			if(isNull(edu001.getEdu300_ID())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-行政班编码不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getSfzh())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-身份证号不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getMzbm())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-民族不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getRxsj())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-入学时间不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//验证数字列内容
			//入学总分
			if(!isNumeric(edu001.getRxzf())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-入学总分必须是数字";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//身高
			if(!isNumeric(edu001.getSg())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-身高必须是数字";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//体重
			if(!isNumeric(edu001.getTz())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-体重必须是数字";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//手机号码
			if(!isPhone(edu001.getSjhm())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-手机号码格式不正确";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//email
			if(!isEmail(edu001.getEmail())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-email格式不正确";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//是否有学籍和学籍号是否为空验证
			if(!chaeckPass){
				break;
			}else{
				if(edu001.getSfyxj().equals("T") && edu001.getXjh()==null){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-学籍号不能为空";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				if(edu001.getSfyxj().equals("F") && edu001.getXjh()!=null){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-学籍号必须为空";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
			}
			
			//上传数据与数据库配对验证
			if(!chaeckPass){
				break;
			}else{
				//培养层次编码是否存在
				pcyys = reflectUtils.administrationPageService.queryAllLevelByPcccbm(edu001.getPycc());
				if(pcyys.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-培养层次编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				//系部编码是否存在
				xbs = reflectUtils.administrationPageService.queryAllDepartmentByXbbm(edu001.getSzxb());
				if(xbs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-系部编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				//年级编码是否存在
				njs = reflectUtils.administrationPageService.queryAllGradeByNjbm(edu001.getNj());
				if(njs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-年级编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				//专业编码是否存在
				zys = reflectUtils.administrationPageService.queryAllMajorByZybm(edu001.getZybm());
				if(zys.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-专业编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				//培养计划是否能对应
				List<Edu107>  pyjh = reflectUtils.administrationPageService.queryPyjh(edu001.getPycc(),edu001.getSzxb(),edu001.getNj(),edu001.getZybm());
				if(pyjh.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-暂无由此行培养层次、所在系部、年级、专业组成的培养计划";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				//行政班编码是否存在
				xzbs = reflectUtils.administrationPageService.queryXzbByEdu300ID(edu001.getEdu300_ID());
				if(xzbs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-行政班不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				
				//行政班编码是否和填写的培养计划对应
				boolean classMatchCultruePaln=reflectUtils.administrationPageService.classMatchCultruePaln(edu001.getEdu300_ID(),edu001.getPycc(),edu001.getSzxb(),edu001.getNj(),edu001.getZybm());
				if(!classMatchCultruePaln){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-行政班与培养计划不对应";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				//状态编码是否存在
				ztbms = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("xszt",edu001.getZtCode());
				if(ztbms.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-学生状态编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				//民族编码是否存在
				mzs = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("mz",edu001.getMzbm());
				if(mzs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-民族编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
				
				//政治面貌编码是否存在
				if(edu001.getZzmmbm()!=null){
					zzmms = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("zzmm",edu001.getZzmmbm());
					if(zzmms.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-政治面貌不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}
				}
				
				//文化程度编码是否存在
				if(edu001.getWhcdbm()!=null){
					whcds = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("whcd",edu001.getWhcdbm());
					if(whcds.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-文化程度不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}
				}
				
				//招生方式编码是否存在
				if(edu001.getZsfscode()!=null){
					zsfss = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("zsfs",edu001.getZsfscode());
					if(zsfss.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-招生方式不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}
				}
			}
			
			//判断学号在数据库是否存在
			if(!chaeckPass){
				break;
			}else{
				List<Edu001> databaseAllStudent = reflectUtils.administrationPageService.queryAllStudent();
				for (int d = 0;d < databaseAllStudent.size(); d++) {
					if(importStudent.get(i).getXh().equals(databaseAllStudent.get(d).getXh())){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行- 学号已存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break allforOver;
					}
				}
			}
			
			//判断身份证号在数据库是否存在
			if(!chaeckPass){
				break;
			}else{
				boolean IDcardIshave = reflectUtils.administrationPageService.IDcardIshave(importStudent.get(i).getSfzh());
				if(IDcardIshave){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行- 身份证号已存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
			}
			
			// 判断新增学生是否会超过行政班容纳人数
			if(!chaeckPass){
				break;
			}else{
				boolean studentSpill = reflectUtils.administrationPageService.administrationClassesIsSpill(importStudent.get(i).getEdu300_ID());
				if(studentSpill){
					List<Edu300> XzbInfo=reflectUtils.administrationPageService.queryXzbByEdu300ID(importStudent.get(i).getEdu300_ID());
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-新增该学生 班级:("+XzbInfo.get(0).getXzbmc()+") 人数超过上限";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}
			}
			
			//所有验证通过  填充各种编码的名称
			if(pcyys!=null){
				edu001.setPyccmc(pcyys.get(0).getPyccmc());
			}
			
			if(xbs!=null){
				edu001.setSzxbmc(xbs.get(0).getXbmc());
			}
			
			if(njs!=null){
				edu001.setNjmc(njs.get(0).getNjmc());
			}
			
			if(zys!=null){
				edu001.setZymc(zys.get(0).getZymc());
			}
			
			if(xzbs!=null){
				edu001.setXzbname(xzbs.get(0).getXzbmc());
			}
			
			if(ztbms!=null){
				edu001.setZt(ztbms.get(0).getEjdmz());
			}
			
			if(mzs!=null){
				edu001.setMz(mzs.get(0).getEjdmz());
			}
		    
			if(zzmms!=null){
				edu001.setZzmm(zzmms.get(0).getEjdmz());
			}
		    
			if(whcds!=null){
				edu001.setWhcd(whcds.get(0).getEjdmz());
			}
		    
			if(zsfss!=null){
				 edu001.setZsfs(zsfss.get(0).getEjdmz());
			}
		}
		
		if(chaeckPass){
			checkTxt="上传文件格式/数据正确";
		} 
		returnMap.put("chaeckPass", chaeckPass);
		returnMap.put("checkTxt", checkTxt);
		returnMap.put("importStudent", importStudent);
		return returnMap;
	}

	/**
	 * 读取上传的Excel数据
	 * @param studentStream 文件输入流
	 * @return List<Map<String,Object>> dataList 返回信息
	 * @throws java.text.ParseException 
	 * */
	public List<Map<String,Object>> getImportData(InputStream studentStream,String keyType)throws EncryptedDocumentException, InvalidFormatException, IOException, java.text.ParseException {
		List<Map<String,Object>> dataList = new ArrayList<Map<String,Object>>();
		//获取Excel工作簿
		Workbook workBook = WorkbookFactory.create(studentStream);
		// 获取sheet个数
		int sheetCount = workBook.getNumberOfSheets();
		
		//如果sheet个数小于等于0 返回null
		if (sheetCount <= 0) {
			return null;
		} else {
			Sheet sheet = workBook.getSheetAt(0); // 读取sheet 0
			int firstRowIndex = sheet.getFirstRowNum() + 1; // 第一行是列名，所以不读
			int lastRowIndex = sheet.getLastRowNum();  //最后一列
			// 遍历行
			for (int rIndex = firstRowIndex; rIndex <= lastRowIndex; rIndex++) {
				Row row = sheet.getRow(rIndex); // 当前行
				if (!isRowEmpty(row)) {
					int firstCellIndex = row.getFirstCellNum(); //第一列
					int lastCellIndex = row.getLastCellNum();  //最后一列
					HashMap<String, Object> hashMap = new HashMap<String, Object>();
					for (int cIndex = firstCellIndex; cIndex < lastCellIndex; cIndex++) { // 遍历列
						//当前列
						Cell cell = row.getCell(cIndex);
						if (cell != null && !cell.equals("")) {
							String keyName="";
							//根据不同需求获取key name
							if(keyType.equals("ImportEdu001")){
							    keyName = getEdu001KeyName(cell.getColumnIndex()); //获取列名
							}
							//行数据不为空 放入返回集
							if(getCellData(cell)!=null&&!getCellData(cell).equals("")){
								hashMap.put(keyName, getCellData(cell));
							}
						}
					}
					dataList.add(hashMap); //追加学生信息
				}
			}
		}
		return dataList;
	}
	
	//获取学生Excel的Key值
	private String getEdu001KeyName(int columnIndex) {
		String result = null;
		switch (columnIndex) {
        case 0:
            result="pycc";
            break;
        case 1:
            result="szxb";
            break;
        case 2:
            result="nj";
            break;
        case 3:
            result="zybm";
            break;
        case 4:
            result="Edu300_ID";
            break;
        case 5:
            result="xh";
            break;
        case 6:
            result="xm";
            break;
        case 7:
            result="zym";
            break;
        case 8:
            result="xb";
            break;
        case 9:
            result="ztCode";
            break;
        case 10:
            result="csrq";
            break;
        case 11:
            result="sfzh";
            break;
        case 12:
            result="mzbm";
            break;
        case 13:
            result="sfyxj";
            break;
        case 14:
            result="xjh";
            break;
        case 15:
            result="zzmmbm";
            break;
        case 16:
            result="syd";
            break;
        case 17:
            result="whcdbm";
            break;
        case 18:
            result="ksh";
            break;
        case 19:
            result="rxzf";
            break;
        case 20:
            result="rxsj";
            break;
        case 21:
            result="byzh";
            break;
        case 22:
            result="zkzh";
            break;
        case 23:
            result="sjhm";
            break;
        case 24:
            result="email";
            break;
        case 25:
            result="jg";
            break;
        case 26:
            result="zy";
            break;
        case 27:
            result="sg";
            break;
        case 28:
            result="tz";
            break;
        case 29:
            result="hf";
            break;
        case 30:
            result="lzjd";
            break;
        case 31:
            result="zsfscode";
            break;
        case 32:
            result="dxpy";
            break;
        case 33:
            result="pkjt";
            break;
        case 34:
            result="jtzz";
            break;
        case 35:
            result="zjxy";
            break;
        case 36:
            result="bz";
            break;
        default:
        	result="ycTxt";
            break;
        }
		return result;
	}

	/*处理空行*/
	@SuppressWarnings("deprecation")
	public static boolean isRowEmpty(Row row) {
		for (int c = row.getFirstCellNum(); c < row.getLastCellNum(); c++) {
		Cell cell = row.getCell(c);
		if (cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK&&!cell.equals(""))
		return false;
		}
		return true;
    }

	// 修改学生导入模板
	public void modifyImportStudentModal(String filePath) throws IOException {
		OutputStream out = null;
		
		// 获取Excel工作簿
		FileInputStream in = new FileInputStream(filePath);
		XSSFWorkbook workbook = new XSSFWorkbook(in);
		// 获取sheet个数 
		int sheetCount = workbook.getNumberOfSheets();
		// 如果模板文件中sheet个数大于1 则删除第二个sheet（避免数据重叠）
		if (sheetCount > 1) {
			out = new FileOutputStream(filePath);
			workbook.removeSheetAt(1);
			workbook.write(out);
		}
		
		//创建新的sheet2
		workbook.createSheet("辅助信息");
		//获取sheet2
		XSSFSheet sheet = workbook.getSheetAt(1);
		//填充sheet2内容
		this.stuffStudentModalSheet2(sheet);

		out = new FileOutputStream(filePath);
		out.flush();
		workbook.write(out);
		workbook.close();
		out.close();
	}
	
	// 更改学生更新模板
	public void updateModifyStudentModal(String filePath,List<Edu001> chosedStudents) throws IOException {
		OutputStream out = null;

		// 获取Excel工作簿
		FileInputStream in = new FileInputStream(filePath);
		XSSFWorkbook workbook = new XSSFWorkbook(in);
		// 获取sheet个数
		int sheetCount = workbook.getNumberOfSheets();
		// 如果模板文件中sheet个数大于1 则删除第二个sheet（避免数据重叠）
		if (sheetCount > 1) {
			out = new FileOutputStream(filePath);
			workbook.removeSheetAt(1);
			workbook.write(out);
		}
		// 获取sheet1
	    XSSFSheet sheet1 = workbook.getSheetAt(0);
	    // 填充sheet1内容
	    this.stuffModifyStudentModalSheet1(sheet1,chosedStudents);
	 		
		// 创建新的sheet2
		workbook.createSheet("辅助信息");
		// 获取sheet2
		XSSFSheet sheet2 = workbook.getSheetAt(1);
		// 填充sheet2内容
		this.stuffStudentModalSheet2(sheet2);

		out = new FileOutputStream(filePath);
		out.flush();
		workbook.write(out);
		workbook.close();
		out.close();
	}
	
	//填充学生导入模板的辅助信息
    private void stuffStudentModalSheet2(XSSFSheet sheet) {
    	List<Edu103> allPcyy = reflectUtils.administrationPageService.queryAllLevel();
		List<Edu104> xb =reflectUtils.administrationPageService.queryAllDepartment();
		List<Edu105> nj = reflectUtils.administrationPageService.queryAllGrade();
		List<Edu106> zy = reflectUtils.administrationPageService.queryAllMajor();
		List<Edu300> xzb = reflectUtils.administrationPageService.queryAllAdministrationClasses();
		List<Edu000> xszt = reflectUtils.administrationPageService.queryEjdm("xszt");
		List<Edu000> zzmm = reflectUtils.administrationPageService.queryEjdm("zzmm");
		List<Edu000> whcd = reflectUtils.administrationPageService.queryEjdm("whcd");
		List<Edu000> zsfs = reflectUtils.administrationPageService.queryEjdm("zsfs");
		List<Edu000> mzbm = reflectUtils.administrationPageService.queryEjdm("mz");
		
		//设置标题
		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];   
		//所有标题数组
		String[] titles = new String[] {
              "培养层次名称", "培养层次编码", "系部名称", "系部编码" , "年级名称", "年级编码", "专业名称", "专业编码", "行政班名称", "行政班编码","民族名称", "民族编码"
             ,"学生状态名称", "学生状态编码","政治面貌名称", "政治面貌编码","文化程度名称", "文化程度编码","招生方式名称", "招生方式编码"
		                               };
		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}

		// 写入培养层次信息
		for (int i = 0; i < allPcyy.size(); i++) {
			XSSFRow row = sheet.createRow(i + 1);
			row.createCell(0).setCellValue(allPcyy.get(i).getPyccmc());
			row.createCell(1).setCellValue(allPcyy.get(i).getPyccbm());
		}

		// 追加系部信息
		for (int i = 0; i < xb.size(); i++) {
			Edu104 edu104=xb.get(i);
			appendCell(sheet,i,edu104.getXbmc(),edu104.getXbbm().toString(),2,3,true);
		}
		
		// 追加年级信息
		for (int i = 0; i < nj.size(); i++) {
			Edu105 edu105=nj.get(i);
			appendCell(sheet,i,edu105.getNjmc(),edu105.getNjbm().toString(),4,5,true);
		}
		
		// 追加专业信息
		for (int i = 0; i < zy.size(); i++) {
			Edu106 edu106=zy.get(i);
			appendCell(sheet,i,edu106.getZymc(),edu106.getZybm().toString(),6,7,true);
		}
		
		// 追加行政班信息
		for (int i = 0; i < xzb.size(); i++) {
			Edu300 edu300=xzb.get(i);
			appendCell(sheet,i,edu300.getXzbmc(),edu300.getEdu300_ID().toString(),8,9,true);
		}
		
		// 追加民族信息
		for (int i = 0; i < mzbm.size(); i++) {
			Edu000 edu000 = mzbm.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 10, 11,true);
		}

		// 追加学生状态信息
		for (int i = 0; i < xszt.size(); i++) {
			Edu000 edu000 = xszt.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 12, 13,true);
		}
		
		// 追加政治面貌信息
		for (int i = 0; i < zzmm.size(); i++) {
			Edu000 edu000 = zzmm.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 14, 15,true);
		}

		// 追加文化程度信息
		for (int i = 0; i < whcd.size(); i++) {
			Edu000 edu000 = whcd.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 16, 17,true);
		}
		
		// 追加招生方式信息
		for (int i = 0; i < zsfs.size(); i++) {
			Edu000 edu000 = zsfs.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 18, 19,true);
		}
	}
    
    //填充更新学生模板的学生信息
    private void stuffModifyStudentModalSheet1(XSSFSheet sheet,List<Edu001> chosedStudents) {
		for (int i = 0; i < chosedStudents.size(); i++) {
			appendCell(sheet,i,"",chosedStudents.get(i).getPycc(),-1,0,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSzxb(),-1,1,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getNj(),-1,2,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZybm(),-1,3,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getEdu300_ID(),-1,4,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXh(),-1,5,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getEdu001_ID().toString(),-1,6,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXm(),-1,7,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZym(),-1,8,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXb(),-1,9,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZtCode(),-1,10,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getCsrq(),-1,11,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSfzh(),-1,12,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getMzbm(),-1,13,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSfyxj(),-1,14,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXjh(),-1,15,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZzmmbm(),-1,16,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSyd(),-1,17,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getWhcdbm(),-1,18,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getKsh(),-1,19,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getRxzf(),-1,20,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getRxsj(),-1,21,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getByzh(),-1,22,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZkzh(),-1,23,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSjhm(),-1,24,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getEmail(),-1,24,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getJg(),-1,25,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZy(),-1,26,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSg(),-1,27,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getTz(),-1,28,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getHf(),-1,29,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getLzjd(),-1,30,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZsfscode(),-1,31,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getDxpy(),-1,32,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getPkjt(),-1,33,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getJtzz(),-1,34,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZjxy(),-1,35,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getBz(),-1,36,false);
		}
	}

    
    /**
     * 向Excel 追加数据
     * @param sheet  当前sheet
     * @param index  当前行的索引
     * @param mc     名称列的值  （stuffTwoCell为false时为""）
     * @param value  真实值列的值
     * @param mcCellIndex  名称列的列索引（stuffTwoCell为false时为-1）
     * @param valueCellIndex  真实值列的列索引
     * @param stuffTwoCell  是否填充两列 （false只填充一列）
     * */
	private void appendCell(XSSFSheet sheet,int index,String mc,String value,int mcCellIndex,int valueCellIndex,boolean stuffTwoCell) {
		if(mc!=null){
			mc=mc.toString();
		}
		if(value!=null){
			value=value.toString();
		}
		
		XSSFRow row = sheet.getRow(index + 1); //从第二行开始追加
		//如果总行数超过当前数据长度 新建行
		if(row==null){
			int rowNum = sheet.getLastRowNum();// 总行数
			row=sheet.createRow(rowNum+1);//新建一行
		}
		if(stuffTwoCell){
			row.createCell(mcCellIndex).setCellValue(mc); 
			row.createCell(valueCellIndex).setCellValue(value);
		}else{
			row.createCell(valueCellIndex).setCellValue(value);
		}
	}

	// 下载模板
	public void loadImportStudentModal(String filePath, HttpServletResponse response) throws IOException {
		File f = new File(filePath);
		if (!f.exists()) {
			response.sendError(404, "File not found!");
			return;
		}
		BufferedInputStream br = new BufferedInputStream(new FileInputStream(f));
		byte[] buf = new byte[1024];
		int len = 0;

		response.reset(); // 非常重要
		response.setContentType("application/x-msdownload");
		response.setHeader("Content-Disposition", "attachment; filename=" + f.getName());
		OutputStream out = response.getOutputStream();
		while ((len = br.read(buf)) > 0)
			out.write(buf, 0, len);
		br.close();
		out.close();
	}
	
	//非空验证
	private boolean isNull(String notNullCell) {
		if(notNullCell==null){
			return true;
		}
		return false;
	}
	
	//判断变量是否能转为数字
	public boolean isNumeric(String str){
		boolean canChangeNumber;
		if(str!=null){
			 Pattern pattern = Pattern.compile("[0-9]*");
			 Matcher isNum = pattern.matcher(str);
			 if( !isNum.matches() ){
				 canChangeNumber=false;
		     }else{
		    	 canChangeNumber=true;
		     }
		}else{
			canChangeNumber=true;
		}
		
		return canChangeNumber;
       
        
        
 }

	//手机号码验证
	public boolean isPhone(String phone) {
		boolean isPhone=true;
		if(phone!=null){
			 String regex = "^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\\d{8}$";
			    if (phone.length() != 11) {
			        return false;
			    } else {
			        Pattern p = Pattern.compile(regex);
			        Matcher m = p.matcher(phone);
			        boolean isMatch = m.matches();
			        return isMatch;
			    }
		}
		return isPhone;
	}

	//email验证
	public boolean isEmail(String email){
		boolean isEmail=true;
		if(null!=email){
			 Pattern p =  Pattern.compile("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");//复杂匹配
		     Matcher m = p.matcher(email);
		     boolean isMatch = m.matches();
		     return isMatch;
		}
		return isEmail;
    }

	
	/**
	 * 解析POI导入cell中的格式数据
	 * @param currentCell
	 * @return currentCellValue
	 * @throws java.text.ParseException 
	 */
	public static String getCellData(Cell currentCell) throws java.text.ParseException {
		String currentCellValue = "";
		// 判断单元格数据是否是日期
		if ("yyyy/mm;@".equals(currentCell.getCellStyle().getDataFormatString())
				|| "m/d/yy".equals(currentCell.getCellStyle().getDataFormatString())
				|| "yy/m/d".equals(currentCell.getCellStyle().getDataFormatString())
				|| "mm/dd/yy".equals(currentCell.getCellStyle().getDataFormatString())
				|| "dd-mmm-yy".equals(currentCell.getCellStyle().getDataFormatString())
				|| "yyyy/m/d".equals(currentCell.getCellStyle().getDataFormatString())) {
			if (DateUtil.isCellDateFormatted(currentCell)) {
				// 用于转化为日期格式
				Date d = currentCell.getDateCellValue();
				if(d!=null){
					DateFormat formater = new SimpleDateFormat("yyyy-MM-dd");
					currentCellValue = formater.format(d);
				}else{
					currentCellValue="";
				}
			}
		} else {
			// 不是日期原值返回
			currentCellValue = currentCell.toString();
		}
		return currentCellValue;
	}
	
	
	//出生日期字符串转化成Date对象
    public static  Date parse(String strDate) throws java.text.ParseException  {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.parse(strDate);
    }


	//由出生日期获得年龄
	public int getAge(Date birthDay) throws Exception {
		Calendar cal = Calendar.getInstance();

		if (cal.before(birthDay)) {
			throw new IllegalArgumentException("The birthDay is before Now.It's unbelievable!");
		}
		int yearNow = cal.get(Calendar.YEAR);
		int monthNow = cal.get(Calendar.MONTH);
		int dayOfMonthNow = cal.get(Calendar.DAY_OF_MONTH);
		cal.setTime(birthDay);

		int yearBirth = cal.get(Calendar.YEAR);
		int monthBirth = cal.get(Calendar.MONTH);
		int dayOfMonthBirth = cal.get(Calendar.DAY_OF_MONTH);

		int age = yearNow - yearBirth;

		if (monthNow <= monthBirth) {
			if (monthNow == monthBirth) {
				if (dayOfMonthNow < dayOfMonthBirth)
					age--;
			} else {
				age--;
			}
		}
		return age;
	}
	
	//上传图片返回工具
	public String getError(String message) {
		JSONObject obj = new JSONObject();
		obj.put("error", 1);
		obj.put("message", message);
		return obj.toString();
	}
	
	 /**
	    * regex：获取<img src="">标签的正则（"<img.*?>"）
	    * string：提取图片标签的内容
	    * isDistinguish：是否区分大小写
	    */
	public List<String> getImgSrc(String htmlStr) {
		String img = "";
		Pattern p_image;
		Matcher m_image;
		List<String> pics = new ArrayList<String>();
		// String regEx_img = "<img.*src=(.*?)[^>]*?>"; //图片链接地址
		String regEx_img = "<img.*src\\s*=\\s*(.*?)[^>]*?>";
		p_image = Pattern.compile(regEx_img, Pattern.CASE_INSENSITIVE);
		m_image = p_image.matcher(htmlStr);
		while (m_image.find()) {
			img = img + "," + m_image.group();
			// Matcher m =
			// Pattern.compile("src=\"?(.*?)(\"|>|\\s+)").matcher(img); //匹配src
			Matcher m = Pattern.compile("src\\s*=\\s*\"?(.*?)(\"|>|\\s+)").matcher(img);
			while (m.find()) {
				pics.add(m.group(1));
			}
		}
		return pics;
	}
	

	







}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	


