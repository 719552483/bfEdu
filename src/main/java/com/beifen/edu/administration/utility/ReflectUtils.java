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
import javax.servlet.http.HttpServletResponse;


import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.assertj.core.util.DateUtil;
import org.springframework.web.multipart.MultipartFile;

import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu103;
import com.beifen.edu.administration.domian.Edu104;
import com.beifen.edu.administration.domian.Edu105;
import com.beifen.edu.administration.domian.Edu106;
import com.beifen.edu.administration.domian.Edu300;

import net.minidev.json.parser.ParseException;


public class ReflectUtils {
	// 缓存类的字段
	private static Map<String, List<Field>> cache = new HashMap<>();

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
	public Map<String, Object> checkFile(MultipartFile file,String checkType,String hopeSheetName,Map<String, List> checkNeedInfo) throws java.text.ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		boolean isExcel=true;
		boolean sheetCountPass=true;
		boolean modalPass=true;
		boolean haveData=true;
		
		// 判断读取的文件是否为Excel文件
		String fileName = file.getOriginalFilename();
		String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
		if (!"xlsx".equals(suffix) && !"xls".equals(suffix)) {
			isExcel = false;
			returnMap.put("isExcel",isExcel);
			return returnMap;
		}
		
		//获取Excel工作簿
		InputStream in=file.getInputStream();
		Workbook workBook = WorkbookFactory.create(in);
		
		int sheetCount = workBook.getNumberOfSheets();// 获取sheet个数
		//验证sheet个数
		if(sheetCount <= 0){
			sheetCountPass=false;
			returnMap.put("sheetCountPass",sheetCountPass);
			returnMap.put("isExcel",isExcel);
			return returnMap;
		}
		
		String sheetName = workBook.getSheetAt(0).getSheetName();//sheet名称
		//验证sheet名字
		if (checkType.equals("edu001")&&!sheetName.equals(hopeSheetName)) {
			modalPass=false;
			returnMap.put("modalPass",modalPass);
			returnMap.put("sheetCountPass",sheetCountPass);
			returnMap.put("isExcel",isExcel);
			return returnMap;
		}
		
		//验证是否有数据
		List<Map<String,Object>> importStudents = this.getImportData(file.getInputStream(),checkType);
		if(importStudents.size()==0){
			haveData=false;
			returnMap.put("haveData",haveData);
			returnMap.put("modalPass",modalPass);
			returnMap.put("sheetCountPass",sheetCountPass);
			returnMap.put("isExcel",isExcel);
			return returnMap;
		}
		
		//验证数据正确性
		if(checkType.equals("edu001")){
			Map<String, Object> datacheckInfo=this.checkImportStudentInfo(importStudents,checkNeedInfo);
			returnMap.put("haveData",haveData);
			returnMap.put("modalPass",modalPass);
			returnMap.put("sheetCountPass",sheetCountPass);
			returnMap.put("isExcel",isExcel);
			returnMap.put("dataCheck", datacheckInfo.get("chaeckPass"));
			returnMap.put("errorTxt", datacheckInfo.get("errorTxt"));
			returnMap.put("importStudent", datacheckInfo.get("importStudent"));
		}
		
		
		return returnMap;
	}


	/**
	 * 验证导入的学生数据
	 * @throws Exception 
	 * @throws java.text.ParseException 
	 * */
	private Map<String, Object> checkImportStudentInfo(List<Map<String, Object>> importStudentsMap,Map<String, List> checkNeedInfo) throws java.text.ParseException, Exception {
		Map<String, Object> returnMap = new HashMap();
		List<Edu001> importStudent=new ArrayList<Edu001>();
		boolean chaeckPass=true;
		
		//组装上传学生对象
		for (int i = 0; i < importStudentsMap.size(); i++) {
			Edu001 edu001 = new Edu001();
			Map<String, Object> studentInfo = importStudentsMap.get(i);
			edu001.setPycc((String) studentInfo.get("pycc"));
			edu001.setSzxb((String) studentInfo.get("szxb"));
			edu001.setNj((String) studentInfo.get("nj"));
			edu001.setZybm((String) studentInfo.get("zybm"));
			edu001.setEdu300_ID((String) studentInfo.get("Edu300_ID"));
			edu001.setXh((String) studentInfo.get("xh"));
			edu001.setXm((String) studentInfo.get("xm"));
			edu001.setXb((String) studentInfo.get("xb"));
			edu001.setZtCode((String) studentInfo.get("ztCode"));
			edu001.setCsrq((String) studentInfo.get("csrq"));
			edu001.setNl(getAge(parse((String) studentInfo.get("csrq"))));
			importStudent.add(edu001);
		}
		
		//非空验证
		for (int i = 0; i < importStudent.size(); i++) {
			Edu001 edu001 = importStudent.get(i);
			if(isNull(edu001.getPycc())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-培养层次编码不能为空");
			}
			if(isNull(edu001.getSzxb())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-系部编码不能为空");
			}
			if(isNull(edu001.getNj())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-年级编码不能为空");
			}
			if(isNull(edu001.getZybm())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-专业编码不能为空");
			}
			if(isNull(edu001.getEdu300_ID())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-行政班编码不能为空");
			}
			if(isNull(edu001.getXh())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-学号不能为空");
			}
			if(isNull(edu001.getXm())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-学生姓名不能为空");
			}
			if(isNull(edu001.getXb())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-性别不能为空");
			}
			if(isNull(edu001.getZtCode())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-学生状态不能为空");
			}
			if(isNull(edu001.getCsrq())){
				returnMap.put("chaeckPass", false);
				returnMap.put("errorTxt", "第"+(i+1)+"行-出生日期不能为空");
			}
		}
		
		
		
		//数据类型和格式验证
		
		//上传数据与数据库配对验证
		
		//是否有学籍和学籍号是否为空验证
		
		 
		
		
		returnMap.put("importStudent", importStudent);
		return returnMap;
	}

	
	
	
	


	/**
	 * 读取上传的Excel数据
	 * @param studentStream 文件输入流
	 * @return List<Map<String,Object>> dataList 返回信息
	 * */
	public List<Map<String,Object>> getImportData(InputStream studentStream,String keyType)throws EncryptedDocumentException, InvalidFormatException, IOException {
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
							if(keyType.equals("edu001")){
							  keyName = getEdu001KeyName(cell.getColumnIndex()); //获取列名
							}
							hashMap.put(keyName, cell.toString());
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
        case 8:
            result="xb";
            break;
        case 9:
            result="ztCode";
            break;
        case 10:
            result="csrq";
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
	public void modifyImportStudentModal(String filePath, Map<String,List> othserInfo) throws IOException {
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
		this.stuffImportStudentModalSheet2(sheet,othserInfo);

		out = new FileOutputStream(filePath);
		out.flush();
		workbook.write(out);
		workbook.close();
		out.close();
	}
	
	//填充学生导入模板的辅助信息
    private void stuffImportStudentModalSheet2(XSSFSheet sheet,Map<String,List> othserInfo) {
    	List<Edu103> allPcyy = othserInfo.get("pcyy");
		List<Edu104> xb = othserInfo.get("xb");
		List<Edu105> nj = othserInfo.get("nj");
		List<Edu106> zy = othserInfo.get("zy");
		List<Edu300> xzb = othserInfo.get("xzb");
		List<Edu000> xszt = othserInfo.get("xszt");
		List<Edu000> zzmm = othserInfo.get("zzmm");
		List<Edu000> whcd = othserInfo.get("whcd");
		List<Edu000> zsfs = othserInfo.get("zsfs");
		//设置标题
		XSSFRow firstRow = sheet.createRow(0);// 第一行
		XSSFCell cells[] = new XSSFCell[1];   
		//所有标题数组
		String[] titles = new String[] {
              "培养层次名称", "培养层次编码", "系部名称", "系部编码" , "年级名称", "年级编码", "专业名称", "专业编码", "行政班名称", "行政班编码"
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
			row.createCell(1).setCellValue(allPcyy.get(i).getEdu103_ID());
		}

		// 追加系部信息
		for (int i = 0; i < xb.size(); i++) {
			Edu104 edu104=xb.get(i);
			appendCell(sheet,i,edu104.getXbmc(),edu104.getEdu104_ID().toString(),2,3);
		}
		
		// 追加年级信息
		for (int i = 0; i < nj.size(); i++) {
			Edu105 edu105=nj.get(i);
			appendCell(sheet,i,edu105.getNjmc(),edu105.getEdu105_ID().toString(),4,5);
		}
		
		// 追加专业信息
		for (int i = 0; i < zy.size(); i++) {
			Edu106 edu106=zy.get(i);
			appendCell(sheet,i,edu106.getZymc(),edu106.getEdu106_ID().toString(),6,7);
		}
		
		// 追加行政班信息
		for (int i = 0; i < xzb.size(); i++) {
			Edu300 edu300=xzb.get(i);
			appendCell(sheet,i,edu300.getXzbmc(),edu300.getEdu300_ID().toString(),8,9);
		}

		// 追加学生状态信息
		for (int i = 0; i < xszt.size(); i++) {
			Edu000 edu000=xszt.get(i);
			appendCell(sheet,i,edu000.getEjdmz(),edu000.getEjdm(),10,11);
		}
		
		// 追加政治面貌信息
		for (int i = 0; i < zzmm.size(); i++) {
			Edu000 edu000 = zzmm.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 12, 13);
		}

		// 追加文化程度信息
		for (int i = 0; i < whcd.size(); i++) {
			Edu000 edu000 = whcd.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 14, 15);
		}
		
		// 追加招生方式信息
		for (int i = 0; i < zsfs.size(); i++) {
			Edu000 edu000 = zsfs.get(i);
			appendCell(sheet, i, edu000.getEjdmz(), edu000.getEjdm(), 16, 17);
		}
	}

	//Excel sheet2追加数据
	private void appendCell(XSSFSheet sheet,int index,String mc,String value,int mcCellIndex,int valueCellIndex) {
		XSSFRow row = sheet.getRow(index + 1); //从第二行开始追加
		//如果总行数超过当前数据长度 新建行
		if(row==null){
			int rowNum = sheet.getLastRowNum();// 总行数
			row=sheet.createRow(rowNum+1);//新建一行
		}
		row.createCell(mcCellIndex).setCellValue(mc); 
		row.createCell(valueCellIndex).setCellValue(value);
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
	
	
	
	
	/**
	 * 解析POI导入Excel中日期格式数据
	 * @param currentCell
	 * @return currentCellValue
	 */
	public static String importByExcelForDate(Cell currentCell) {
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
				DateFormat formater = new SimpleDateFormat("yyyy-MM-dd");
				currentCellValue = formater.format(d);
			}
		} else {
			// 不是日期原值返回
			currentCellValue = currentCell.toString();
		}
		return currentCellValue;
	}
	
	
	//出生日期字符串转化成Date对象
    public  Date parse(String strDate) throws java.text.ParseException  {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.parse(strDate);
    }


	//由出生日期获得年龄
	public String getAge(Date birthDay) throws Exception {
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
		return String.valueOf(age);
	}
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	


