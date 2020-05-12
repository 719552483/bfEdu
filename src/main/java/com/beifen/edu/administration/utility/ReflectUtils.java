package com.beifen.edu.administration.utility;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

import javax.servlet.http.HttpServletResponse;

import java.util.Date;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.poifs.filesystem.POIFSFileSystem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.beifen.edu.administration.domian.Edu000;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.service.AdministrationPageService;

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
	 * @param suffix文件后缀名
	 * @return checkPass 验证结果
	 * */
	public boolean checkFileType(String  suffix) {
       boolean checkPass=true;
	   if (!"xlsx".equals(suffix) && !"xls".equals(suffix)) {
		   checkPass=false;
	   }
		return checkPass;
	}

	/**
	 * 读取上传学生的Excel 获取学生信息
	 * @param studentStream 学生文件输入流
	 * @return List<Map<String,Object>> dataList 学生信息
	 * */
	public List<Map<String,Object>> getImportStudent(InputStream studentStream)throws EncryptedDocumentException, InvalidFormatException, IOException {
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
							String keyName = getKeyName(cell.getColumnIndex()); //获取列名
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
	private String getKeyName(int columnIndex) {
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

	
	
	//下载末班
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
		
		
		
	

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	


