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
import org.apache.poi.ss.usermodel.DataValidation;
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
			if(isNull(edu001.getRxsj())){
				chaeckPass=false;
				checkTxt="第"+(i+1)+"行-入学时间不能为空";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				break;
			}
			
			boolean strCanChnageDate= isValidDate(edu001.getRxsj().toString());
			if(!strCanChnageDate){
				chaeckPass = false;
				checkTxt = "第" + (i + 1) + "行-入校时间格式不正确(正确格式:1990-01-01)";
				returnMap.put("chaeckPass", chaeckPass);
				returnMap.put("checkTxt", checkTxt);
				return returnMap;
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
			
			//验证来自军队格式
			if(!chaeckPass){
				break;
			}else{
				if(edu001.getLzjd()!=null&&!edu001.getLzjd().equals("是")&&!edu001.getLzjd().equals("否")){
					chaeckPass=false;
					checkTxt= "第"+(i+1)+"行-来自军队只接受(是)或(否)";
					returnMap.put("chaeckPass", chaeckPass);
					returnMap.put("checkTxt",checkTxt);
					break;
				}else if(edu001.getLzjd()!=null&&(edu001.getLzjd().equals("是")||edu001.getLzjd().equals("否"))){
					if(edu001.getLzjd().equals("是")){
						edu001.setLzjd("T");
					}else{
						edu001.setLzjd("F");
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
				String currentXzbCode= Long.toString(reflectUtils.administrationPageService.queryEdu300IdByEdu300Name(edu001.getEdu300_ID()));
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
			
			List<Edu001> databaseAllStudent=null;
			//判断学号在数据库是否存在
			if(!chaeckPass){
				break;
			}else{
				databaseAllStudent = reflectUtils.administrationPageService.queryAllStudent();
				if(isModify){
					for (int d = 0;d < databaseAllStudent.size(); d++) {
						if(databaseAllStudent.get(d).getEdu001_ID().equals(edu001.getEdu001_ID())){
							databaseAllStudent.remove(d);
						}
					}
				}
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
				if(isModify){
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
					if(oldXzb.equals(newXzb)){
						needCheckXzb=false;
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

	//获取批量修改学生Excel的Key值
	private String getModifyEdu001KeyName(int columnIndex) {
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
            result="lzjd";
            break;
        case 32:
            result="zsfscode";
            break;
        case 33:
            result="dxpy";
            break;
        case 34:
            result="pkjt";
            break;
        case 35:
            result="jtzz";
            break;
        case 36:
            result="zjxy";
            break;
        case 37:
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
		String[] titles = new String[] {"*培养层次", "*所在系部", "*年级", "*专业", "*行政班ID", "*学号", "*学生ID", "*学生姓名",
				"曾用名", "*性别", "*状态", "*出生日期", "*身份证号 ", "*民族", "是否有学籍 ", "学籍号", "政治面貌", "生源地 ",
				"文化程度", "考生号", "入学总分", "*入学时间", "毕业证号 ", "准考证号", "手机号码 ", "email", "籍贯", "职业 ",
				"身高", "体重", "婚否 ", "来自军队", "招生方式 ", "定向培养", "贫困家庭 ", "家庭住址", "宗教信仰", "备注 " };
		
		// 循环设置标题
		for (int i = 0; i < titles.length; i++) {
			cells[0] = firstRow.createCell(i);
			cells[0].setCellValue(titles[i]);
		}
    	
		//循环填充数据
		for (int i = 0; i < chosedStudents.size(); i++) {
			appendCell(sheet,i,"",chosedStudents.get(i).getPyccmc(),-1,0,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSzxbmc(),-1,1,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getNjmc(),-1,2,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZymc(),-1,3,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXzbname(),-1,4,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getXh(),-1,5,false);
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
			appendCell(sheet,i,"",chosedStudents.get(i).getEmail(),-1,24,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getJg(),-1,25,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZy(),-1,26,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getSg(),-1,27,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getTz(),-1,28,false);
			if(chosedStudents.get(i).getHf()!=null){
				if(chosedStudents.get(i).getHf().equals("T")){
					appendCell(sheet,i,"","已婚",-1,29,false);
				}else{
					appendCell(sheet,i,"","未婚",-1,29,false);
				}
			}
			if(chosedStudents.get(i).getLzjd()!=null){
				if(chosedStudents.get(i).getLzjd().equals("T")){
					appendCell(sheet,i,"","是",-1,30,false);
				}else{
					appendCell(sheet,i,"","否",-1,30,false);
				}
			}
			if(chosedStudents.get(i).getZsfscode()!=null){
				String zsfsTxt=reflectUtils.administrationPageService.queryEjdmZByEjdm(chosedStudents.get(i).getZsfscode(),"招生方式");
				appendCell(sheet,i,"",zsfsTxt,-1,31,false);
			}
			if(chosedStudents.get(i).getDxpy()!=null){
				if(chosedStudents.get(i).getDxpy().equals("T")){
					appendCell(sheet,i,"","是",-1,32,false);
				}else{
					appendCell(sheet,i,"","否",-1,32,false);
				}
			}
			
			if(chosedStudents.get(i).getPkjt()!=null){
				if(chosedStudents.get(i).getPkjt().equals("T")){
					appendCell(sheet,i,"","是",-1,33,false);
				}else{
					appendCell(sheet,i,"","否",-1,33,false);
				}
			}
			
			appendCell(sheet,i,"",chosedStudents.get(i).getJtzz(),-1,34,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getZjxy(),-1,35,false);
			appendCell(sheet,i,"",chosedStudents.get(i).getBz(),-1,36,false);
		}
	}
	
    //填充导入学生模板的Sheet1
    private void stuffStudentInfoSheet1(XSSFSheet sheet) {
		// 设置标题
		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];
		
		// 所有标题数组
		String[] titles = new String[] {"*培养层次", "*系部", "*年级", "*专业", "*行政班ID", "*学号", "*学生姓名",
				"曾用名", "*性别", "*状态", "*出生日期", "*身份证号 ", "*民族", "是否有学籍 ", "学籍号", "政治面貌", "生源地 ",
				"文化程度", "考生号", "入学总分", "*入学时间", "毕业证号 ", "准考证号", "手机号码 ", "email", "籍贯", "职业 ",
				"身高", "体重", "婚否 ", "来自军队", "招生方式 ", "定向培养", "贫困家庭 ", "家庭住址", "宗教信仰", "备注 " };
		
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
		int  maxRoeNum=1048575;
		HashMap<String, String> sexMap=new HashMap<String, String>();
		sexMap.put("F", "女");
		sexMap.put("M", "男");
		
		HashMap<String, String> isOrNotMap=new HashMap<String, String>();
		isOrNotMap.put("T", "否");
		isOrNotMap.put("F", "是");
		
		HashMap<String, String> marrayOrNotMap=new HashMap<String, String>();
		marrayOrNotMap.put("T", "已婚");
		marrayOrNotMap.put("F", "未婚");
		
		HashMap<String, String> ztMap=new HashMap<String, String>();
		List<Edu000> ztbms = reflectUtils.administrationPageService.queryEjdm("xszt");
		for (int i = 0; i < ztbms.size(); i++) {
			ztMap.put(ztbms.get(i).getEjdm(), ztbms.get(i).getEjdmz());
		}
		
		HashMap<String, String> mzMap=new HashMap<String, String>();
		List<Edu000> mzbms = reflectUtils.administrationPageService.queryEjdm("mz");
		for (int i = 0; i < mzbms.size(); i++) {
			mzMap.put(mzbms.get(i).getEjdm(), mzbms.get(i).getEjdmz());
		}
		
		HashMap<String, String> zsfsMap=new HashMap<String, String>();
		List<Edu000> zsfss = reflectUtils.administrationPageService.queryEjdm("zsfs");
		for (int i = 0; i < zsfss.size(); i++) {
			zsfsMap.put(zsfss.get(i).getEjdm(), zsfss.get(i).getEjdmz());
		}
		
		HashMap<String, String> whcdMap=new HashMap<String, String>();
		List<Edu000> whcds = reflectUtils.administrationPageService.queryEjdm("whcd");
		for (int i = 0; i < whcds.size(); i++) {
			whcdMap.put(whcds.get(i).getEjdm(), whcds.get(i).getEjdmz());
		}
		
		HashMap<String, String> zzmmMap=new HashMap<String, String>();
		List<Edu000> zzmms = reflectUtils.administrationPageService.queryEjdm("zzmm");
		for (int i = 0; i < zzmms.size(); i++) {
			zzmmMap.put(zzmms.get(i).getEjdm(), zzmms.get(i).getEjdmz());
		}
		
		HashMap<String, String> pyccMap=new HashMap<String, String>();
		List<Edu103> pyccs = reflectUtils.administrationPageService.queryAllLevel();
		for (int i = 0; i < pyccs.size(); i++) {
			pyccMap.put(pyccs.get(i).getPyccbm(), pyccs.get(i).getPyccmc());
		}
		
		HashMap<String, String> xbMap=new HashMap<String, String>();
		List<Edu104> xbs = reflectUtils.administrationPageService.queryAllDepartment();
		for (int i = 0; i < xbs.size(); i++) {
			xbMap.put(xbs.get(i).getXbbm(), xbs.get(i).getXbmc());
		}
		
		HashMap<String, String> njMap=new HashMap<String, String>();
		List<Edu105> njs = reflectUtils.administrationPageService.queryAllGrade();
		for (int i = 0; i < njs.size(); i++) {
			njMap.put(njs.get(i).getNjbm(), njs.get(i).getNjmc());
		}
		
		HashMap<String, String> zyMap=new HashMap<String, String>();
		List<Edu106> zys = reflectUtils.administrationPageService.queryAllMajor();
		for (int i = 0; i < zys.size(); i++) {
			zyMap.put(zys.get(i).getZybm(), zys.get(i).getZymc());
		}
		
		HashMap<String, String> xzbMap=new HashMap<String, String>();
		List<Edu300> xzbs = reflectUtils.administrationPageService.queryAllAdministrationClasses();
		for (int i = 0; i < xzbs.size(); i++) {
			xzbMap.put(xzbs.get(i).getEdu300_ID().toString(), xzbs.get(i).getXzbmc());
		}
		
		int[] pyccIndex={0};
		int[] xbIndex={1};
		int[] njIndex={2};
		int[] zyIndex={3};
		int[] xzbIndex={4};
		int[] sexNeedIndex={8};
		int[] ztNeedIndex={9};
		int[] mzNeedIndex={12};
		int[] zzmmIndex={15};
		int[]  whcdIndex={17};
		int[]  marrayOrNotIndex={29};
		int[] isOrNOTNeedIndex={13,30,32,33};
		int[]  zsfsIndex={31};
		
		if(filename.equals("ImportStudent")||filename.equals("导入学生模板")){
			for (int i = 0; i < pyccIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, pyccIndex[i], pyccIndex[i], pyccMap);
			}
			
			for (int i = 0; i < xbIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, xbIndex[i], xbIndex[i], xbMap);
			}
			
			for (int i = 0; i < njIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, njIndex[i], njIndex[i], njMap);
			}
			
			for (int i = 0; i < zyIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, zyIndex[i], zyIndex[i], zyMap);
			}
			
			for (int i = 0; i < xzbIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, xzbIndex[i], xzbIndex[i], xzbMap);
			}
			
			for (int i = 0; i < sexNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, sexNeedIndex[i], sexNeedIndex[i], sexMap);
			}
			
			for (int i = 0; i < ztNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, ztNeedIndex[i], ztNeedIndex[i], ztMap);
			}
			
			for (int i = 0; i < mzNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, mzNeedIndex[i], mzNeedIndex[i], mzMap);
			}
			
			for (int i = 0; i < zzmmIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, zzmmIndex[i], zzmmIndex[i], zzmmMap);
			}
			
			for (int i = 0; i < whcdIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, whcdIndex[i], whcdIndex[i], whcdMap);
			}
			
			for (int i = 0; i < marrayOrNotIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, marrayOrNotIndex[i], marrayOrNotIndex[i], marrayOrNotMap);
			}
			
			for (int i = 0; i < isOrNOTNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, isOrNOTNeedIndex[i], isOrNOTNeedIndex[i], isOrNotMap);
			}
			
			for (int i = 0; i < zsfsIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, zsfsIndex[i], zsfsIndex[i], zsfsMap);
			}
		}else if(filename.equals("modifyStudents")||filename.equals("批量更新学生模板")){
			for (int i = 0; i < pyccIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, pyccIndex[i], pyccIndex[i], pyccMap);
			}
			
			for (int i = 0; i < xbIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, xbIndex[i], xbIndex[i], xbMap);
			}
			
			for (int i = 0; i < njIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, njIndex[i], njIndex[i], njMap);
			}
			
			for (int i = 0; i < zyIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, zyIndex[i], zyIndex[i], zyMap);
			}
			
			for (int i = 0; i < xzbIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, xzbIndex[i], xzbIndex[i], xzbMap);
			}
			
			for (int i = 0; i < sexNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, sexNeedIndex[i]+1, sexNeedIndex[i]+1, sexMap);
			}
			
			for (int i = 0; i < ztNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, ztNeedIndex[i]+1, ztNeedIndex[i]+1, ztMap);
			}
			
			for (int i = 0; i < mzNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, mzNeedIndex[i]+1, mzNeedIndex[i]+1, mzMap);
			}
			
			for (int i = 0; i < zzmmIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, zzmmIndex[i]+1, zzmmIndex[i]+1, zzmmMap);
			}
			
			for (int i = 0; i < whcdIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, whcdIndex[i]+1, whcdIndex[i]+1, whcdMap);
			}
			
			for (int i = 0; i < marrayOrNotIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, marrayOrNotIndex[i]+1, marrayOrNotIndex[i]+1, marrayOrNotMap);
			}
			
			for (int i = 0; i < isOrNOTNeedIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, isOrNOTNeedIndex[i]+1, isOrNOTNeedIndex[i]+1, isOrNotMap);
			}
			
			for (int i = 0; i < zsfsIndex.length; i++) {
				addValidate2Cell(workbook.getSheetAt(0), 1,maxRoeNum, zsfsIndex[i]+1, zsfsIndex[i]+1, zsfsMap);
			}
		}
	}
    
	//cell设置下拉框
	private void addValidate2Cell(Sheet sheet, int firstRow, int lastRow, int firstCol, int lastCol,HashMap<String, String> deviceCategryMap) {
		//值的范围为空，则不添加校验
		if(deviceCategryMap == null || deviceCategryMap.isEmpty()) 
			return;
		
		try {
			Collection<String> collection = deviceCategryMap.values();
			String[] category = new String[collection.size()];
			collection.toArray(category);
			if(sheet instanceof HSSFSheet){
				CellRangeAddressList addressList = new CellRangeAddressList(firstRow, lastRow, firstCol, lastCol);
				DVConstraint dvConstraint = DVConstraint.createExplicitListConstraint(category);
				DataValidation dataValidation = new HSSFDataValidation(addressList, dvConstraint);
				dataValidation.setSuppressDropDownArrow(false); //03默认false
				sheet.addValidationData(dataValidation);
			}else if(sheet instanceof XSSFSheet){
				XSSFDataValidationHelper dvHelper = new XSSFDataValidationHelper((XSSFSheet) sheet);
				XSSFDataValidationConstraint dvConstraint = (XSSFDataValidationConstraint)dvHelper.createExplicitListConstraint(category);
				CellRangeAddressList addressList = new CellRangeAddressList(firstRow, lastRow, firstCol, lastCol);
				XSSFDataValidation validation = (XSSFDataValidation)dvHelper.createValidation(dvConstraint, addressList);
				validation.setShowErrorBox(true);
				validation.setSuppressDropDownArrow(true); //07默认true
				sheet.addValidationData(validation); 
			}
		} catch (Exception e) {
			//log.error("下拉框的选项过多导致出错：java.lang.IllegalArgumentException:String literals in formulas can't be bigger than 255 characters ASCII");
            e.printStackTrace();
		}
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

}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	


