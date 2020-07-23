package com.beifen.edu.administration.utility;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;


import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.hssf.usermodel.DVConstraint;
import org.apache.poi.hssf.usermodel.HSSFDataValidation;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.DataValidation;
import org.apache.poi.ss.usermodel.DataValidationConstraint;
import org.apache.poi.ss.usermodel.DataValidationHelper;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFDataFormat;
import org.apache.poi.xssf.usermodel.XSSFDataValidation;
import org.apache.poi.xssf.usermodel.XSSFDataValidationConstraint;
import org.apache.poi.xssf.usermodel.XSSFDataValidationHelper;
import org.apache.poi.xssf.usermodel.XSSFFont;
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
		Object dataCheck="";
		Object checkTxt="";
		Object importStudent="";
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
			}else if(sheetCountPass&&checkType.equals("ModifyEdu001")&&sheetName.equals(hopeSheetName)){
				modalPass=true;
			}
			
			//验证是否有数据
			List<Map<String,Object>> importStudents = this.getImportData(file.getInputStream(),checkType);
			if(sheetCountPass&&modalPass&&importStudents.size()>0){
				haveData=true;
			}
			
			//验证数据正确性
			if(sheetCountPass&&modalPass&&haveData){
				if(checkType.equals("ImportEdu001")||checkType.equals("ModifyEdu001")){
					boolean isModify;
					if (checkType.equals("ImportEdu001"))
						isModify=false;
					else
						 isModify=true;
					Map<String, Object> datacheckInfo=this.checkStudentInfo(importStudents,isModify);
					dataCheck=datacheckInfo.get("chaeckPass");
					checkTxt=datacheckInfo.get("checkTxt");
					importStudent=datacheckInfo.get("importStudent");
				}
			}
		}
		
		returnMap.put("isExcel",isExcel);
		returnMap.put("sheetCountPass",sheetCountPass);
		returnMap.put("modalPass",modalPass);
		returnMap.put("haveData",haveData);
		returnMap.put("dataCheck",dataCheck );
		returnMap.put("checkTxt", checkTxt);
		returnMap.put("importStudent",importStudent);
		return returnMap;
	}

	/**
	 * 验证导入的学生数据
	 * @throws Exception 
	 * @throws java.text.ParseException 
	 * */
	private Map<String, Object> checkStudentInfo(List<Map<String, Object>> importStudentsMap,boolean isModify) throws java.text.ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		List<Edu001> importStudent=new ArrayList<Edu001>();
		boolean chaeckPass=true;
		String checkTxt="";
		
		//组装上传学生对象
		for (int i = 0; i < importStudentsMap.size(); i++) {
			Edu001 edu001 = JSON.parseObject(JSON.toJSONString(importStudentsMap.get(i)), Edu001.class); // mapToBean
			if (edu001.getCsrq() != null) {
				boolean strCanChnageDate= isValidDate(importStudentsMap.get(i).get("csrq").toString());
				if(!strCanChnageDate){
					chaeckPass = false;
					checkTxt = "第" + (i + 1) + "行-出生日期格式不正确(正确格式:1990-01-01)";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					return returnMap;
				}
				
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
			if(isNull(edu001.getXm())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-学生姓名不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			if(isNull(edu001.getSylx())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-生源类型不能为空";
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
			
			if(!edu001.getXb().equals("男")&&!edu001.getXb().equals("女")){
				chaeckPass=false;
				checkTxt= "第"+(i+1)+"行-性别只接受(男)或(女)";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt",checkTxt);
				break;
			}else if(edu001.getXb().equals("男")||edu001.getXb().equals("女")){
				if (edu001.getXb().equals("男"))
					edu001.setXb("M");
				else{
					edu001.setXb("F");
				}
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
				checkTxt="第"+(i+1)+"行-行政班ID不能为空";
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
			
			//入学时间不为空则验证格式
			if(!isNull(edu001.getRxsj())){
				boolean strCanChnageDate= isValidDate(edu001.getRxsj().toString());
				if(!strCanChnageDate){
					chaeckPass = false;
					checkTxt = "第" + (i + 1) + "行-入校时间格式不正确(正确格式:1990-01-01)";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					return returnMap;
				}
			}
			
		
			
			//验证数字列内容
			//入学总分
			if(edu001.getRxzf()!=null&&!isNumeric(edu001.getRxzf())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-入学总分必须是数字";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//身高
			if(edu001.getSg()!=null&&!isNumeric(edu001.getSg())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-身高必须是数字";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//体重
			if(edu001.getTz()!=null&&!isNumeric(edu001.getTz())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-体重必须是数字";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			
			//身份证号格式
			if(edu001.getSfzh()!=null&&!isIDCard(edu001.getSfzh())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-身份证号格式不正确";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//手机号码
			if(edu001.getSjhm()!=null&&!isPhone(edu001.getSjhm())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-手机号码格式不正确";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			//email
			if(edu001.getEmail()!=null&&!isEmail(edu001.getEmail())){
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
				if(edu001.getSfyxj()!=null){
					if(!edu001.getSfyxj().equals("是")&&!edu001.getSfyxj().equals("否")){
						chaeckPass=false;
						checkTxt= "第"+(i+1)+"行-是否有学籍只接受(是)或(否)";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt",checkTxt);
						break;
					}else if(edu001.getSfyxj().equals("是")||edu001.getSfyxj().equals("否")){
						if(edu001.getSfyxj().equals("是")){
							edu001.setSfyxj("T");
						}else{
							edu001.setSfyxj("F");
						}
					}
					
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
				}else{
					if(edu001.getXjh()!=null){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-学籍号必须为空";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}
				}
			}
			
			//验证婚否格式
			if(!chaeckPass){
				break;
			}else{
				if(edu001.getHf()!=null&&!edu001.getHf().equals("已婚")&&!edu001.getHf().equals("未婚")){
					chaeckPass=false;
					checkTxt= "第"+(i+1)+"行-婚否只接受(已婚)或(未婚)";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt",checkTxt);
					break;
				}else if(edu001.getHf()!=null&&(edu001.getHf().equals("已婚")||edu001.getHf().equals("未婚"))){
					if(edu001.getHf().equals("已婚")){
						edu001.setHf("T");
					}else{
						edu001.setHf("F");
					}
				}
			}
			
			
			//验证定向培养格式
			if (!chaeckPass) {
				break;
			} else {
				if (edu001.getDxpy() != null && !edu001.getDxpy().equals("是") && !edu001.getDxpy().equals("否")) {
					chaeckPass = false;
					checkTxt = "第" + (i + 1) + "行-定向培养只接受(是)或(否)";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				} else if (edu001.getDxpy() != null && (edu001.getDxpy().equals("是") || edu001.getDxpy().equals("否"))) {
					if (edu001.getDxpy().equals("是")) {
						edu001.setDxpy("T");
					} else {
						edu001.setDxpy("F");
					}
				}
			}
			
			
			//验证贫困家庭格式
			if(!chaeckPass){
				break;
			}else{
				if(edu001.getPkjt()!=null&&!edu001.getPkjt().equals("是")&&!edu001.getPkjt().equals("否")){
					chaeckPass=false;
					checkTxt= "第"+(i+1)+"行-贫困家庭只接受(是)或(否)";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt",checkTxt);
					break;
				}else if(edu001.getPkjt()!=null&&(edu001.getPkjt().equals("是")||edu001.getPkjt().equals("否"))){
					if(edu001.getPkjt().equals("是")){
						edu001.setPkjt("T");
					}else{
						edu001.setPkjt("F");
					}
				}
			}
			
			//上传数据与数据库配对验证
			if(!chaeckPass){
				break;
			}else{
				//如果是更新操作判断学生id是否存在
				if(isModify){
					Edu001 haveThisStudent=reflectUtils.administrationPageService.queryStudentBy001ID(edu001.getEdu001_ID().toString());
					if(haveThisStudent==null){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-学生ID不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}
				}
				
				String currentsSylxCode=reflectUtils.administrationPageService.queryEjdmByEjdmZ(edu001.getSylx(),"sylx");
				if(currentsSylxCode==null){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-生源类型不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setSylxbm(currentsSylxCode);
				}
				
				//培养层次编码是否存在
				String currentPyccCode=reflectUtils.administrationPageService.queryLevelCodeByLevelName(edu001.getPycc());
				pcyys = reflectUtils.administrationPageService.queryAllLevelByPcccbm(currentPyccCode);
				if(pcyys.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-培养层次编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setPycc(currentPyccCode);
				}
				//系部编码是否存在
				String currentXbCode=reflectUtils.administrationPageService.queryXbCodeByXbName(edu001.getSzxb());
				xbs = reflectUtils.administrationPageService.queryAllDepartmentByXbbm(currentXbCode);
				if(xbs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-系部编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setSzxb(currentXbCode);
				}
				
				//年级编码是否存在
				String currentNjCode=reflectUtils.administrationPageService.queryNjCodeByNjName(edu001.getNj());
				njs = reflectUtils.administrationPageService.queryAllGradeByNjbm(currentNjCode);
				if(njs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-年级编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setNj(currentNjCode);
				}
				
				//专业编码是否存在
				String currentZyCode=reflectUtils.administrationPageService.queryZyCodeByZyName(edu001.getZybm());
				zys = reflectUtils.administrationPageService.queryAllMajorByZybm(currentZyCode);
				if(zys.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-专业编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setZybm(currentZyCode);
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
				Object currentXzbCode_Ob=reflectUtils.administrationPageService.queryEdu300IdByEdu300Name(edu001.getEdu300_ID());
				if(currentXzbCode_Ob!=null){
					String currentXzbCode= Long.toString(Long.valueOf(String.valueOf(currentXzbCode_Ob)).longValue());
					xzbs = reflectUtils.administrationPageService.queryXzbByEdu300ID(currentXzbCode);
					if(xzbs.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-行政班不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}else{
						edu001.setEdu300_ID(currentXzbCode);
					}
				}else{
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
				String currentZtbmCode= reflectUtils.administrationPageService.queryEjdmByEjdmZ(edu001.getZtCode(),"xszt");
				ztbms = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("xszt",currentZtbmCode);
				if(ztbms.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-学生状态编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setZtCode(currentZtbmCode);
				}
				
				//民族编码是否存在
				String currentMzbmCode= reflectUtils.administrationPageService.queryEjdmByEjdmZ(edu001.getMzbm(),"mz");
				mzs = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("mz",currentMzbmCode);
				if(mzs.size()==0){
					chaeckPass=false;
					checkTxt="第"+(i+1)+"行-民族编码不存在";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt", checkTxt);
					break;
				}else{
					edu001.setMzbm(currentMzbmCode);
				}
				
				//政治面貌编码是否存在
				String currentZzmmCode= reflectUtils.administrationPageService.queryEjdmByEjdmZ(edu001.getZzmmbm(),"zzmm");
				if(edu001.getZzmmbm()!=null){
					zzmms = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("zzmm",currentZzmmCode);
					if(zzmms.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-政治面貌不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}else{
						edu001.setZzmmbm(currentZzmmCode);
					}
				}
				
				//文化程度编码是否存在
				String currentWHCDCode= reflectUtils.administrationPageService.queryEjdmByEjdmZ(edu001.getWhcdbm(),"whcd");
				if(edu001.getWhcdbm()!=null){
					whcds = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("whcd",currentWHCDCode);
					if(whcds.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-文化程度不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}else{
						edu001.setWhcdbm(currentWHCDCode);
					}
				}
				
				//招生方式编码是否存在
				String currentZsfsCode= reflectUtils.administrationPageService.queryEjdmByEjdmZ(edu001.getZsfscode(),"zsfs");
				if(edu001.getWhcdbm()!=null){
				if(edu001.getZsfscode()!=null){
					zsfss = reflectUtils.administrationPageService.queryEjdmByGroupAndValue("zsfs",currentZsfsCode);
					if(zsfss.size()==0){
						chaeckPass=false;
						checkTxt="第"+(i+1)+"行-招生方式不存在";
						returnMap.put("chaeckPass", chaeckPass);
						returnMap.put("checkTxt", checkTxt);
						break;
					}else{
						edu001.setZsfscode(currentZsfsCode);
						}
					}
				}
			}
			if(isModify){
				String correctXh=reflectUtils.administrationPageService.queryXhBy001ID(edu001.getEdu001_ID().toString());
				edu001.setXh(correctXh);
			}
			
			List<Edu001> databaseAllStudent=reflectUtils.administrationPageService.queryAllStudent();
			
			//判断身份证号在数据库是否存在
			if(!chaeckPass){
				break;
			}else{
				if(isModify){
					for (int d = 0; d < databaseAllStudent.size(); d++) {
						if (databaseAllStudent.get(d).getEdu001_ID().equals(edu001.getEdu001_ID())) {
							databaseAllStudent.remove(d);
						}
					}
					
					for (int d = 0;d < databaseAllStudent.size(); d++) {
						if(databaseAllStudent.get(d).getSfzh().equals(edu001.getSfzh())){
							chaeckPass=false;
							checkTxt="第"+(i+1)+"行- 身份证号已存在";
							returnMap.put("chaeckPass", chaeckPass);
							returnMap.put("checkTxt", checkTxt);
							break;
						}
					}
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
			}
			
			// 判断新增学生是否会超过行政班容纳人数
			if(!chaeckPass){
				break;
			}else{
				boolean needCheckXzb=true;
				if(isModify){
					//判断是否改变行政班
					String oldXzb=reflectUtils.administrationPageService.queryStudentXzbCode(edu001.getEdu001_ID().toString());
					String newXzb=edu001.getEdu300_ID().toString();
					if(oldXzb!=null){
						if(oldXzb.equals(newXzb)){
							needCheckXzb=false;
						}
					}
				}
                if(needCheckXzb){
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
							    keyName = getImportantEdu001KeyName(cell.getColumnIndex()); //获取列名
							}
							if(keyType.equals("ModifyEdu001")){
							    keyName = getModifyEdu001KeyName(cell.getColumnIndex()); //获取列名
							}
							//行数据不为空 放入返回集
							if(getCellData(cell)!=null&&!getCellData(cell).equals("")){
								String Value=getCellData(cell);
								 hashMap.put(keyName, Value);
							}
						}
					}
					dataList.add(hashMap); //追加学生信息
				}
			}
		}
		return dataList;
	}
	
	//获取导入学生Excel的Key值
	private String getImportantEdu001KeyName(int columnIndex) {
		String result = null;
		switch (columnIndex) {
		case 0:
            result="sylx";
            break;
        case 1:
            result="pycc";
            break;
        case 2:
            result="szxb";
            break;
        case 3:
            result="nj";
            break;
        case 4:
            result="zybm";
            break;
        case 5:
            result="Edu300_ID";
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
            result="zsfscode";
            break;
        case 31:
            result="dxpy";
            break;
        case 32:
            result="pkjt";
            break;
        case 33:
            result="jtzz";
            break;
        case 34:
            result="zjxy";
            break;
        case 35:
            result="bz";
            break;
        default:
        	result="ycTxt";
            break;
        }
		return result;
	}

	//获取批量修改学生Excel的Key值
	private String getModifyEdu001KeyName(int columnIndex) {
		String result = null;
		switch (columnIndex) {
		case 0:
            result="sylx";
            break;
        case 1:
            result="pycc";
            break;
        case 2:
            result="szxb";
            break;
        case 3:
            result="nj";
            break;
        case 4:
            result="zybm";
            break;
        case 5:
            result="Edu300_ID";
            break;
        case 6:
            result="Edu001_ID";
            break;
        case 7:
            result="xm";
            break;
        case 8:
            result="zym";
            break;
        case 9:
            result="xb";
            break;
        case 10:
            result="ztCode";
            break;
        case 11:
            result="csrq";
            break;
        case 12:
            result="sfzh";
            break;
        case 13:
            result="mzbm";
            break;
        case 14:
            result="sfyxj";
            break;
        case 15:
            result="xjh";
            break;
        case 16:
            result="zzmmbm";
            break;
        case 17:
            result="syd";
            break;
        case 18:
            result="whcdbm";
            break;
        case 19:
            result="ksh";
            break;
        case 20:
            result="rxzf";
            break;
        case 21:
            result="rxsj";
            break;
        case 22:
            result="byzh";
            break;
        case 23:
            result="zkzh";
            break;
        case 24:
            result="sjhm";
            break;
        case 25:
            result="email";
            break;
        case 26:
            result="jg";
            break;
        case 27:
            result="zy";
            break;
        case 28:
            result="sg";
            break;
        case 29:
            result="tz";
            break;
        case 30:
            result="hf";
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

	// 导入学生模板
	public void createImportStudentModal(XSSFWorkbook workbook){
		// 创建创建sheet1
		XSSFSheet sheet1 = workbook.createSheet("导入学生信息");
		this.stuffStudentInfoSheet1(sheet1);
	}
	
	// 批量更新学生模板
	public void createModifyStudentModal(XSSFWorkbook workbook,List<Edu001> chosedStudents) {
		//创建创建sheet1
		XSSFSheet sheet1 = workbook.createSheet("已选学生信息");
		this.stuffStudentInfoSheet1(sheet1,chosedStudents);
	}
	
	//填充更新学生模板的Sheet1
    private void stuffStudentInfoSheet1(XSSFSheet sheet,List<Edu001> chosedStudents) {
		// 设置标题
		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		// 所有标题数组
		String[] titles = new String[] {"*生源类型","*培养层次", "*所在系部", "*年级", "*专业", "*行政班", "*学生ID", "*学生姓名",
				"曾用名", "*性别", "*状态", "*出生日期", "*身份证号 ", "*民族", "是否有学籍 ", "学籍号", "政治面貌", "生源地 ",
				"文化程度", "考生号", "入学总分", "*入学时间", "毕业证号 ", "准考证号", "手机号码 ", "email", "籍贯", "职业 ",
				"身高", "体重", "婚否 ", "招生方式 ", "定向培养", "贫困家庭 ", "家庭住址", "宗教信仰", "备注 " };
		
		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}
    	
		//循环填充数据
		for (int i = 0; i < chosedStudents.size(); i++) {
			appendCell(sheet,i,"",chosedStudents.get(i).getSylx(),-1,0,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getPyccmc(),-1,1,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSzxbmc(),-1,2,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getNjmc(),-1,3,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZymc(),-1,4,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXzbname(),-1,5,false);
//			appendCell(sheet,i,"",chosedStudents.get(i).getXh(),-1,5,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getEdu001_ID().toString(),-1,6,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXm(),-1,7,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZym(),-1,8,false);
			if(chosedStudents.get(i).getXb().equals("M")){
				appendCell(sheet,i,"","男",-1,9,false);
			}else{
				appendCell(sheet,i,"","女",-1,9,false);
			}
			String ztTxt=reflectUtils.administrationPageService.queryEjdmZByEjdm(chosedStudents.get(i).getZtCode(),"学生状态");
			appendCell(sheet,i,"",ztTxt,-1,10,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getCsrq(),-1,11,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSfzh(),-1,12,false);
			String mzTxt=reflectUtils.administrationPageService.queryEjdmZByEjdm(chosedStudents.get(i).getMzbm(),"民族");
			appendCell(sheet,i,"",mzTxt,-1,13,false);
			if(chosedStudents.get(i).getSfyxj()!=null){
				if(chosedStudents.get(i).getSfyxj().equals("T")){
					appendCell(sheet,i,"","是",-1,14,false);
				}else{
					appendCell(sheet,i,"","否",-1,14,false);
				}
			}
			appendCell(sheet,i,"",chosedStudents.get(i).getXjh(),-1,15,false);
			String zzmmTxt=reflectUtils.administrationPageService.queryEjdmZByEjdm(chosedStudents.get(i).getZzmmbm(),"政治面貌");
			appendCell(sheet,i,"",zzmmTxt,-1,16,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSyd(),-1,17,false);
			String whcdTxt=reflectUtils.administrationPageService.queryEjdmZByEjdm(chosedStudents.get(i).getWhcdbm(),"文化程度");
			appendCell(sheet,i,"",whcdTxt,-1,18,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getKsh(),-1,19,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getRxzf(),-1,20,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getRxsj(),-1,21,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getByzh(),-1,22,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZkzh(),-1,23,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSjhm(),-1,24,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getEmail(),-1,25,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getJg(),-1,26,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZy(),-1,27,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSg(),-1,28,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getTz(),-1,29,false);
			if(chosedStudents.get(i).getHf()!=null){
				if(chosedStudents.get(i).getHf().equals("T")){
					appendCell(sheet,i,"","已婚",-1,31,false);
				}else{
					appendCell(sheet,i,"","未婚",-1,31,false);
				}
			}
	
			if(chosedStudents.get(i).getZsfscode()!=null){
				String zsfsTxt=reflectUtils.administrationPageService.queryEjdmZByEjdm(chosedStudents.get(i).getZsfscode(),"招生方式");
				appendCell(sheet,i,"",zsfsTxt,-1,31,false);
			}
			if(chosedStudents.get(i).getDxpy()!=null){
				if(chosedStudents.get(i).getDxpy().equals("T")){
					appendCell(sheet,i,"","是",-1,33,false);
				}else{
					appendCell(sheet,i,"","否",-1,33,false);
				}
			}
			
			if(chosedStudents.get(i).getPkjt()!=null){
				if(chosedStudents.get(i).getPkjt().equals("T")){
					appendCell(sheet,i,"","是",-1,34,false);
				}else{
					appendCell(sheet,i,"","否",-1,34,false);
				}
			}
			
			appendCell(sheet,i,"",chosedStudents.get(i).getJtzz(),-1,35,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZjxy(),-1,36,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getBz(),-1,37,false);
		}
	}
	
    //填充导入学生模板的Sheet1
    private void stuffStudentInfoSheet1(XSSFSheet sheet) {
		// 设置标题
		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		
		// 所有标题数组
		String[] titles = new String[] {"*生源类型","*培养层次", "*系部", "*年级", "*专业", "*行政班","*学生姓名",
				"曾用名", "*性别", "*状态", "*出生日期", "*身份证号 ", "*民族", "是否有学籍 ", "学籍号", "政治面貌", "生源地 ",
				"文化程度", "考生号", "入学总分", "*入学时间", "毕业证号 ", "准考证号", "手机号码 ", "email", "籍贯", "职业 ",
				"身高", "体重", "婚否 ", "招生方式 ", "定向培养", "贫困家庭 ", "家庭住址", "宗教信仰", "备注 " };
		
		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
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
	public void loadImportStudentModal(HttpServletResponse response,String filename, XSSFWorkbook workbook) throws IOException, ParseException {
		setEXCELstyle(workbook);
		setEXCELformatter(workbook);
		ExcelStuffSelect(workbook,filename);
        // 解决导出文件名中文乱码
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+new String(filename.getBytes("UTF-8"),"iso-8859-1")+".xls");
        response.setHeader("Content-type","application/vnd.ms-excel");
        workbook.write(response.getOutputStream());
	}
	
	//为Excel填充下拉框
	public void ExcelStuffSelect(XSSFWorkbook workbook,String filename){
		int needCreatHiddenSheetNum=0;
		
		List < String > sexlist = new ArrayList < String > ();
		sexlist.add("男");
		sexlist.add("女");
		needCreatHiddenSheetNum++;
		String[]sexArrays = sexlist.toArray(new String[sexlist.size()]);
		

		List < String > isOrNotlist = new ArrayList < String > ();
		isOrNotlist.add("是");
		isOrNotlist.add("否");
		needCreatHiddenSheetNum++;
		String[]isOrNotArrays = isOrNotlist.toArray(new String[isOrNotlist.size()]);
		

		List < String > marrayOrNotlist = new ArrayList < String > ();
		marrayOrNotlist.add("未婚");
		marrayOrNotlist.add("已婚");
		needCreatHiddenSheetNum++;
		String[]marrayOrNotArrays = marrayOrNotlist.toArray(new String[marrayOrNotlist.size()]);
		
		List < String > sxlxlist = new ArrayList < String > ();
		List<Edu000> sxlxbms = reflectUtils.administrationPageService.queryEjdm("sylx");
		for (int i = 0; i < sxlxbms.size(); i++) {
			sxlxlist.add(sxlxbms.get(i).getEjdmz());
		}
		needCreatHiddenSheetNum++;
		String[]sxlxArrays = sxlxlist.toArray(new String[sxlxlist.size()]);
		
		
		List < String > ztlist = new ArrayList < String > ();
		List<Edu000> ztbms = reflectUtils.administrationPageService.queryEjdm("xszt");
		for (int i = 0; i < ztbms.size(); i++) {
			ztlist.add(ztbms.get(i).getEjdmz());
		}
		needCreatHiddenSheetNum++;
		String[]ztArrays = ztlist.toArray(new String[ztlist.size()]);
		

		List < String > mzlist = new ArrayList < String > ();
		List<Edu000> mzbms = reflectUtils.administrationPageService.queryEjdm("mz");
		for (int i = 0; i < mzbms.size(); i++) {
			mzlist.add(mzbms.get(i).getEjdmz());
		}
		needCreatHiddenSheetNum++;
		String[]mzArrays = mzlist.toArray(new String[mzlist.size()]);
		

		List < String > zsfslist = new ArrayList < String > ();
		List<Edu000> zsfss = reflectUtils.administrationPageService.queryEjdm("zsfs");
		for (int i = 0; i < zsfss.size(); i++) {
			zsfslist.add(zsfss.get(i).getEjdmz());
		}
		needCreatHiddenSheetNum++;
		String[]zsfsArrays = zsfslist.toArray(new String[zsfslist.size()]);
		

		List < String > whcdlist = new ArrayList < String > ();
		List<Edu000> whcds = reflectUtils.administrationPageService.queryEjdm("whcd");
		for (int i = 0; i < whcds.size(); i++) {
			whcdlist.add(whcds.get(i).getEjdmz());
		}
		needCreatHiddenSheetNum++;
		String[]whcdArrays = whcdlist.toArray(new String[whcdlist.size()]);
		

		List < String > zzmmlist = new ArrayList < String > ();
		List<Edu000> zzmms = reflectUtils.administrationPageService.queryEjdm("zzmm");
		for (int i = 0; i < zzmms.size(); i++) {
			zzmmlist.add(zzmms.get(i).getEjdmz());
		}
		needCreatHiddenSheetNum++;
		String[]zzmmArrays = zzmmlist.toArray(new String[zzmmlist.size()]);
		

		List < String > pycclist = new ArrayList < String > ();
		List<Edu103> pyccs = reflectUtils.administrationPageService.queryAllLevel();
		for (int i = 0; i < pyccs.size(); i++) {
			pycclist.add(pyccs.get(i).getPyccmc());
		}
		needCreatHiddenSheetNum++;
		String[]pyccArrays = pycclist.toArray(new String[pycclist.size()]);
		

		List < String > xblist = new ArrayList < String > ();
		List<Edu104> xbs = reflectUtils.administrationPageService.queryAllDepartment();
		for (int i = 0; i < xbs.size(); i++) {
			xblist.add(xbs.get(i).getXbmc());
		}
		needCreatHiddenSheetNum++;
		String[]xbArrays = xblist.toArray(new String[xblist.size()]);
		

		List < String > njlist = new ArrayList < String > ();
		List<Edu105> njs = reflectUtils.administrationPageService.queryAllGrade();
		for (int i = 0; i < njs.size(); i++) {
			njlist.add(njs.get(i).getNjmc());
		}
		needCreatHiddenSheetNum++;
		String[]njArrays = njlist.toArray(new String[njlist.size()]);
		

		List < String > zylist = new ArrayList < String > ();
		List<Edu106> zys = reflectUtils.administrationPageService.queryAllMajor();
		for (int i = 0; i < zys.size(); i++) {
			zylist.add(zys.get(i).getZymc());
		}
		needCreatHiddenSheetNum++;
		String[]zyArrays = zylist.toArray(new String[zylist.size()]);
		

		List < String > xzblist = new ArrayList < String > ();
		List<Edu300> xzbs = reflectUtils.administrationPageService.queryAllAdministrationClasses();
		for (int i = 0; i < xzbs.size(); i++) {
			xzblist.add(xzbs.get(i).getXzbmc());
		}
		needCreatHiddenSheetNum++;
		String[]xzbArrays = xzblist.toArray(new String[xzblist.size()]);
		
		int[] sylxIndex={0};
		int[] pyccIndex={1};
		int[] xbIndex={2};
		int[] njIndex={3};
		int[] zyIndex={4};
		int[] xzbIndex={5};
		int[] sexNeedIndex={8};
		int[] ztNeedIndex={9};
		int[] mzNeedIndex={12};
		int[] zzmmIndex={15};
		int[]  whcdIndex={17};
		int[]  marrayOrNotIndex={29};
		int[] isOrNOTNeedIndex={13,31,32};
		int[]  zsfsIndex={30};
		String hiddenSheetName = "typelist";
		
		if(filename.equals("ImportStudent")||filename.equals("导入学生模板")){
			for (int i = 0; i < needCreatHiddenSheetNum; i++) {
				hiddenSheetName = hiddenSheetName+(i+1);
				if(i==0){
					cell2Select(workbook,hiddenSheetName,sxlxArrays,sylxIndex,false);
				}else if(i==1){
					cell2Select(workbook,hiddenSheetName,sexArrays,sexNeedIndex,false);
				}else if(i==2){
					cell2Select(workbook,hiddenSheetName,isOrNotArrays,isOrNOTNeedIndex,false);
				}else if(i==3){
					cell2Select(workbook,hiddenSheetName,marrayOrNotArrays,marrayOrNotIndex,false);
				}else if(i==4){
					cell2Select(workbook,hiddenSheetName,ztArrays,ztNeedIndex,false);
				}else if(i==5){
					cell2Select(workbook,hiddenSheetName,mzArrays,mzNeedIndex,false);
				}else if(i==6){
					cell2Select(workbook,hiddenSheetName,zsfsArrays,zsfsIndex,false);
				}else if(i==7){
					cell2Select(workbook,hiddenSheetName,whcdArrays,whcdIndex,false);
				}else if(i==8){
					cell2Select(workbook,hiddenSheetName,zzmmArrays,zzmmIndex,false);
				}else if(i==9){
					cell2Select(workbook,hiddenSheetName,pyccArrays,pyccIndex,false);
				}else if(i==10){
					cell2Select(workbook,hiddenSheetName,xbArrays,xbIndex,false);
				}else if(i==11){
					cell2Select(workbook,hiddenSheetName,njArrays,njIndex,false);
				}else if(i==12){
					cell2Select(workbook,hiddenSheetName,zyArrays,zyIndex,false);
				}else if(i==13){
					cell2Select(workbook,hiddenSheetName,xzbArrays,xzbIndex,false);
				}
			}
		}else if(filename.equals("modifyStudents")||filename.equals("批量更新学生模板")){
			for (int i = 0; i < needCreatHiddenSheetNum; i++) {
				hiddenSheetName = hiddenSheetName+(i+1);
				if(i==0){
					cell2Select(workbook,hiddenSheetName,sxlxArrays,sylxIndex,false);
				}else if(i==1){
					cell2Select(workbook,hiddenSheetName,sexArrays,sexNeedIndex,true);
				}else if(i==2){
					cell2Select(workbook,hiddenSheetName,isOrNotArrays,isOrNOTNeedIndex,true);
				}else if(i==3){
					cell2Select(workbook,hiddenSheetName,marrayOrNotArrays,marrayOrNotIndex,true);
				}else if(i==4){
					cell2Select(workbook,hiddenSheetName,ztArrays,ztNeedIndex,true);
				}else if(i==5){
					cell2Select(workbook,hiddenSheetName,mzArrays,mzNeedIndex,true);
				}else if(i==6){
					cell2Select(workbook,hiddenSheetName,zsfsArrays,zsfsIndex,true);
				}else if(i==7){
					cell2Select(workbook,hiddenSheetName,whcdArrays,whcdIndex,true);
				}else if(i==8){
					cell2Select(workbook,hiddenSheetName,zzmmArrays,zzmmIndex,true);
				}else if(i==9){
					cell2Select(workbook,hiddenSheetName,pyccArrays,pyccIndex,false);
				}else if(i==10){
					cell2Select(workbook,hiddenSheetName,xbArrays,xbIndex,false);
				}else if(i==11){
					cell2Select(workbook,hiddenSheetName,njArrays,njIndex,false);
				}else if(i==12){
					cell2Select(workbook,hiddenSheetName,zyArrays,zyIndex,false);
				}else if(i==13){
					cell2Select(workbook,hiddenSheetName,xzbArrays,xzbIndex,false);
				}
			}
		}
	}
    
	
	//单元格变为下拉框
    public static void cell2Select(XSSFWorkbook workbook,String hiddenShhetName,String[] useArrays,int[] useIndex,boolean useIndexNeedAdd){
    	int  maxRoeNum=1048575;
		// 如：typelist!$A$1:$A$59 表示A列1-59行作为下拉列表来源数据
		String formula = hiddenShhetName+"!$A$1:$A$" ;
		genearteOtherSheet(workbook, useArrays, hiddenShhetName);
		for (int i = 0; i < useIndex.length; i++) {
			int finaluseIndex=useIndex[i];
			if(useIndexNeedAdd){
				finaluseIndex=finaluseIndex+1;
			}
			workbook.getSheetAt(0).addValidationData(SetDataValidation(workbook, formula + useArrays.length, 1,finaluseIndex, maxRoeNum, finaluseIndex));
		}
		workbook.setSheetHidden(workbook.getSheetIndex(hiddenShhetName), 1);
	}

	
	
	// 设置并引用其他Sheet作为绑定下拉列表数据
	public static DataValidation SetDataValidation(Workbook wb, String strFormula, int firstRow, int firstCol, int endRow, int endCol) {
	    // 原顺序为 起始行 起始列 终止行 终止列
	    CellRangeAddressList regions = new CellRangeAddressList(firstRow, endRow, firstCol, endCol);
	    DataValidationHelper dvHelper = new XSSFDataValidationHelper((XSSFSheet)wb.getSheet("typelist"));
	    DataValidationConstraint formulaListConstraint = dvHelper.createFormulaListConstraint(strFormula);
	    DataValidation dataValidation = dvHelper.createValidation(formulaListConstraint, regions);

	    return dataValidation;
	}

	// 创建下拉列表值存储工作表并设置值
	public static void genearteOtherSheet(Workbook wb, String[]typeArrays,String newSheetName) {
	    // 创建下拉列表值存储工作表
	    Sheet sheet = wb.createSheet(newSheetName);
	    // 循环往该sheet中设置添加下拉列表的值
	    for (int i = 0; i < typeArrays.length; i++) {
	        Row row = sheet.createRow(i);
	        Cell cell = row.createCell((int)0);
	        cell.setCellValue(typeArrays[i]);
	    }
	}
	
	// 设置隐藏sheet列信息样式
	public static void setStyle(Workbook wb, Sheet sheet, int colNum) {
	    CellStyle cellStyle = wb.createCellStyle();
	    cellStyle.setAlignment(CellStyle.ALIGN_CENTER);
	    DataFormat format = wb.createDataFormat();
	    cellStyle.setDataFormat(format.getFormat("@"));

	    sheet.setDefaultColumnStyle(colNum, cellStyle);
	}
	
	//设置模title样式
	private void setEXCELstyle(XSSFWorkbook workbook) throws ParseException {
		workbook.getSheetAt(0).getRow(0).setHeightInPoints(30); //sheet1标题行行高设置
		
		//sheet1 样式
		Row row = workbook.getSheetAt(0).getRow(0); //  sheet1第一行标题行
		int firstCellIndex = row.getFirstCellNum(); //  sheet1第一行标题行第一cell
		int lastCellIndex = row.getLastCellNum(); //  sheet1第一行标题行最后cell
		//遍历sheet1 标题行cell
		for (int cIndex = firstCellIndex; cIndex <= lastCellIndex; cIndex++) {
			//标题列全局样式
			CellStyle style = workbook.createCellStyle();
			style.setVerticalAlignment(XSSFCellStyle.VERTICAL_CENTER);//上下对齐
			style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());//背景色
			style.setFillPattern(CellStyle.SOLID_FOREGROUND);//前景色
			XSSFFont redFont = workbook.createFont();
			// 当前cell
			Cell cell = row.getCell(cIndex);
			if(cell!=null&&!getCellData(cell).equals("")){
				if(cell.toString().indexOf("*")!=-1){
					// 必填列样式
					redFont.setColor(IndexedColors.RED.getIndex());//文字颜色
					style.setFont(redFont);//文字颜色
					cell.setCellStyle(style);
					cell.setCellValue(cell.toString());
				}else{
					redFont.setColor(IndexedColors.GREY_80_PERCENT.getIndex());//文字颜色
					style.setFont(redFont);//文字颜色
					cell.setCellStyle(style);
					cell.setCellValue(cell.toString());
				}
			}
		}
		
	}
	
	//设置模板数据类型
	private void setEXCELformatter(XSSFWorkbook workbook) {
		//设置sheet1数据格式为文本
		Sheet sheet = workbook.getSheetAt(0); // 读取sheet 0
		int firstRowIndex = sheet.getFirstRowNum(); // 第一行
		int lastRowIndex = sheet.getLastRowNum();  //最后一列
		// 遍历行
		for (int rIndex = firstRowIndex; rIndex <= lastRowIndex; rIndex++) {
			Row row = sheet.getRow(rIndex); // 当前行
			int firstCellIndex = row.getFirstCellNum(); //第一列
			int lastCellIndex = row.getLastCellNum();  //最后一列
			for (int cIndex = firstCellIndex; cIndex < lastCellIndex; cIndex++) { // 遍历列
				CellStyle textStyle = workbook.createCellStyle();
				XSSFDataFormat format = workbook.createDataFormat();
				textStyle.setDataFormat(format.getFormat("@"));
				workbook.getSheetAt(0).setDefaultColumnStyle(cIndex, textStyle);
			}
		}
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
		if(str!=null&&!str.equals("")){
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
		if(phone!=null&&!phone.equals("")){
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
		if(null!=email&&!email.equals("")){
			 Pattern p =  Pattern.compile("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");//复杂匹配
		     Matcher m = p.matcher(email);
		     boolean isMatch = m.matches();
		     return isMatch;
		}
		return isEmail;
    }

	//身份证验证
	public boolean isIDCard(String idCardNum) {
		boolean isidCardNum=true;
		if(null!=idCardNum&&!idCardNum.equals("")){
			String regex = "\\d{15}(\\d{2}[0-9xX])?";
			if(idCardNum.matches(regex)){
				isidCardNum= true;
			}else{
				isidCardNum= false;
			}
		}
		return isidCardNum;
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
			if(currentCell.getCellType()==1){
				if(!isValidDate(currentCell.toString()) ){
					currentCellValue="error";
				}else{
					// 用于转化为日期格式1
					Date date = HSSFDateUtil.getJavaDate(Double.parseDouble(currentCell.toString()));
					currentCellValue = new SimpleDateFormat("yyyy-MM-dd").format(date);
				}
			}else if(currentCell.getCellType()==0){
				// 用于转化为日期格式2
				currentCellValue=currentCell.toString();
				currentCellValue = new SimpleDateFormat("yyyy-MM-dd").format(currentCell.getDateCellValue());
			}
		} else {
			//数据格式统一都为文本格式
			if(currentCell.getCellType() == Cell.CELL_TYPE_NUMERIC){
				currentCell.setCellType(Cell.CELL_TYPE_STRING);
	        }
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

    //判断字符能否转为日期
    private static boolean isValidDate(String str) {
        boolean convertSuccess = true;
        // 指定日期格式为四位年/两位月份/两位日期，注意yyyy/MM/dd区分大小写；
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        try {
            // 设置lenient为false.
            // 否则SimpleDateFormat会比较宽松地验证日期，比如2007/02/29会被接受，并转换成2007/03/01
            format.setLenient(false);
            format.parse(str);
        } catch (ParseException e) {
            // e.printStackTrace();
            // 如果throw java.text.ParseException或者NullPointerException，就说明格式不对
            convertSuccess = false;
        }
        return convertSuccess;
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
	

	/**
	  * 获取浏览器是否为ie
	  * @Title: getBrowserName
	  * @data:2015-1-12下午05:08:49
	  * @author:wolf
	  *
	  * @param agent
	  * @return
	  */

	public boolean isIE(String agent) {
		boolean rs =false;
		if (agent.indexOf("trident") !=-1) {
			rs = true;
		} else  {
			rs = false;
		}
		 return rs;
	}


	/**
	 *32位默认长度的uuid 
	 * (获取32位uuid)
	 * 
	 * @return
	 */
	public static  String getUUID()
	{
		return UUID.randomUUID().toString().replace("-", "");
	}
	
	/**
	 *
	 * (获取指定长度uuid)
	 * 
	 * @return
	 */
	public static  String getUUID(int len)
	{
		if(0 >= len)
		{
			return null;
		}
		
		String uuid = getUUID();
		StringBuffer str = new StringBuffer();
		
		for (int i = 0; i < len; i++)
		{
			str.append(uuid.charAt(i));
		}
		
		return str.toString().toUpperCase();
	}

	/**
	 *
	 * (获取指定长度随机数)
	 * 
	 * @return
	 */
	public static String getRandom(int len) {
        Random r = new Random();
        StringBuilder rs = new StringBuilder();
        for (int i = 0; i < len; i++) {
            rs.append(r.nextInt(10));
        }
        return rs.toString();
    }
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	


