package com.beifen.edu.administration.service;

import com.beifen.edu.administration.PO.CourseCheckOnPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.criteria.*;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

//教职工管理业务层
@Service
public class StaffManageService {

    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu001Dao edu001Dao;
    @Autowired
    Edu201Dao edu201Dao;
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    Edu205Dao edu205Dao;
    @Autowired
    Edu005Dao edu005Dao;
    @Autowired
    Edu108Dao edu108Dao;
    @Autowired
    Edu107Dao edu107Dao;
    @Autowired
    Edu302Dao edu302Dao;
    @Autowired
    Edu208Dao edu208Dao;
    @Autowired
    Edu203Dao edu203Dao;
    @Autowired
    ApprovalProcessService approvalProcessService;
    @Autowired
    CourseCheckOnDao courseCheckOnDao;
    @Autowired
    RedisUtils redisUtils;


    ReflectUtils utils = new ReflectUtils();



    //新增教师
    public void addTeacher(Edu101 edu101) {
        edu101Dao.save(edu101);

        Edu990 edu990 = new Edu990();
        edu990.setYhm(edu101.getJzgh());
        edu990.setMm("123456");
        edu990.setJs("教职工");
        edu990.setJsId("8050");
        edu990.setUserKey(edu101.getEdu101_ID().toString());
        edu990.setPersonName(edu101.getXm());
        edu990Dao.save(edu990);

        Edu992 edu992 = new Edu992();
        edu992.setBF990_ID(edu990.getBF990_ID());
        edu992.setBF991_ID(Long.parseLong("8051"));
        edu992Dao.save(edu992);

    }

    // 根据id查询教师所有信息
    public Edu101 queryTeacherBy101ID(String techerId) {
        return edu101Dao.queryTeacherBy101ID(techerId);
    }

    // 根据id查询教职工号
    public String queryJzghBy101ID(String techerId) {
        return edu101Dao.queryJzghBy101ID(techerId);
    }

    // 查询所有教师
    public List<Edu101> queryAllTeacher() {
        return edu101Dao.findAll();
    }

    //查询教师任务书
    public boolean checkTeacherTasks(String edu101Id) {
        boolean canRemove=true;
        List<Edu201> teacherTasks =edu201Dao.queryTaskByTeacherID(edu101Id);
        List<Edu201> mainTeacherTasks =edu201Dao.queryMainTaskByTeacherID(edu101Id);
        if(teacherTasks.size()>0||mainTeacherTasks.size()>0){
            canRemove=false;
        }
        return canRemove;
    }

    //删除教师
    public void removeTeacher(String edu101Id) {
        edu101Dao.removeTeacher(edu101Id);
    }

    //查询教师身份证号是否已存在
    public boolean teacherIDcardIshave(String sfzh) {
        boolean isHave = false;
        if (sfzh != null) {
            List<Edu101> IDcards = edu101Dao.teacherIDcardIshave(sfzh);
            if (IDcards.size() > 0)
                isHave = true;
        }
        return isHave;
    }

    // 为教师生成学号
    public String getNewTeacherJzgh() {
        String jzgh_before =utils.getRandom(2);
        String newXh = "1"+jzgh_before+utils.getRandom(3);
        return newXh;
    }


    //根据权限查询所有教师
    public ResultVO queryAllTeacherByUserId(String userId) {
        ResultVO resultVO;

        //从redis中查询二级学院管理权限
        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        List<Edu101> teacherList = edu101Dao.queryAllTeacherByUserId(departments);

        if(teacherList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无教师信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+teacherList.size()+"个教师",teacherList);
        }

        return resultVO;
    }


    //查询需要录入成绩学生
    public ResultVO queryGrades(String userId, Edu001 edu001, Edu005 edu005) {
        ResultVO resultVO;
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();

        //查询教师任务书ID列表
        List<String> edu201IdList = edu205Dao.findEdu201IdByTeacher(userKey);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        //根据条件筛选培养计划
        Specification<Edu107> specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String>get("edu103"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String>get("edu104"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.like(root.<String>get("edu105"), '%' + edu001.getNj() + '%'));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String>get("edu106"), edu001.getZybm()));
                }

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> edu107List = edu107Dao.findAll(specification);
        if (edu107List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<Long> edu107IdList = edu107List.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }
        List<String> edu201Ids = edu201Dao.getTaskByEdu108Ids(edu108IdList);
        //两个201id集合去交集
        edu201IdList.retainAll(edu201Ids);
        if(edu201IdList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可以录入成绩的课程");
            return resultVO;
        }

        List edu201ids = utils.heavyListMethod(edu201IdList);

        //根据条件筛选成绩表
        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu005.getCourseName() != null && !"".equals(edu005.getCourseName())) {
                    predicates.add(cb.like(root.<String>get("courseName"), "%" + edu005.getCourseName() + "%"));
                }
                if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
                    predicates.add(cb.like(root.<String>get("studentName"),"%"+edu001.getXm()+"%"));
                }
                if (edu001.getXh() != null && !"".equals(edu001.getXh())) {
                    predicates.add(cb.like(root.<String>get("studentCode"),"%"+edu001.getXh()+"%"));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String>get("className"),"%"+edu001.getXzbname()+"%"));
                }
                if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
                    predicates.add(cb.equal(root.<String>get("xnid"),edu005.getXnid()));
                }

                Path<Object> Edu201Path = root.get("edu201_ID");//定义查询的字段
                CriteriaBuilder.In<Object> inEdu201 = cb.in(Edu201Path);
                for (int i = 0; i < edu201ids.size(); i++) {
                    inEdu201.value(edu201ids.get(i));//存入值
                }
                predicates.add(cb.and(inEdu201));

                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合要求的学生");
        } else {
            resultVO = ResultVO.setSuccess("查找成功",edu005List);
        }

        return resultVO;
    }

    //录入或修改成绩
    public ResultVO giveGrade(Edu005 edu005) {
        ResultVO resultVO;
        Date currentTime = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        String dateString = formatter.format(currentTime);
        edu005.setEntryDate(dateString);
        if ("F".equals(edu005.getGrade())) {
            edu005.setGetCredit(0.00);
            edu005.setIsPassed("F");
        } else if ("T".equals(edu005.getGrade())) {
            edu005.setGetCredit(edu005.getCredit());
            edu005.setIsPassed("T");
        } else {
            double i = Double.parseDouble(edu005.getGrade());
            if (i < 60.00) {
                edu005.setGetCredit(0.00);
                edu005.setIsPassed("F");
            } else {
                edu005.setGetCredit(edu005.getCredit());
                edu005.setIsPassed("T");
            }
        }
        edu005Dao.save(edu005);
        resultVO = ResultVO.setSuccess("成绩录入成功",dateString);
        return resultVO;
    }


    //查询所有老师
    public ResultVO queryAllTeachers() {
        ResultVO resultVO;
        List<Edu101> edu101List = edu101Dao.findAll();
        if(edu101List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无可选老师");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu101List);
        }
        return resultVO;
    }


    //获取考勤信息
    public CourseCheckOnPO getCourseCheckOnInfo(String courseId) {
        CourseCheckOnPO courseCheckOnPO = courseCheckOnDao.findOne(courseId);
        return courseCheckOnPO;
    }

    //创建考勤情况模版
    public XSSFWorkbook creatCourseCheckOnModal(CourseCheckOnPO courseCheckOnPO) {
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet("考勤情况详情");

        //编写注意事项
        XSSFRow firstRow = sheet.createRow(0);// 第一行
        XSSFCell cell = firstRow.createCell(0);
        XSSFFont font = workbook.createFont();
        font.setColor(IndexedColors.RED.getIndex());//文字颜色
        CellStyle style = workbook.createCellStyle();
        style.setFont(font);
        cell.setCellStyle(style);
        cell.setCellValue("注意：出勤情况请填写代码，01为正常，02为缺席");


        XSSFRow secondRow = sheet.createRow(1);// 第二行
        XSSFCell cells[] = new XSSFCell[1];
        // 所有标题数组
        String[] titles = new String[] {"学年","课程名称","周数","星期","课节","行政班名称","学生姓名","学号","出勤情况"};

        // 循环设置标题
        for (int i = 0; i < titles.length; i++) {
            cells[0] = secondRow.createCell(i);
            cells[0].setCellValue(titles[i]);
        }

        //根据任务书获取学生名单
        Edu201 one = edu201Dao.findOne(Long.parseLong(courseCheckOnPO.getEdu201_id()));
        List<String> edu300Ids = new ArrayList<>();
        if ("01".equals(one.getClassType())) {
            edu300Ids.add(one.getClassId().toString());
        } else {
            List<String> edu300IdsByEdu301Id = edu302Dao.findEdu300IdsByEdu301Id(one.getClassId().toString());
            edu300Ids.addAll(edu300IdsByEdu301Id);
        }
        List<Edu001> studentInEdu300 = edu001Dao.getStudentInEdu300(edu300Ids);

        for (int i = 0; i < studentInEdu300.size(); i++) {
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getXn(),-1,0,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getKcmc(),-1,1,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getWeek(),-1,2,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getXqmc(),-1,3,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getKjmc(),-1,4,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getXzbname(),-1,5,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getXm(),-1,6,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getXh(),-1,7,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getEdu203_id(),-1,9,false);
            utils.appendCell(sheet,i+1,"",courseCheckOnPO.getEdu201_id(),-1,10,false);
            utils.appendCell(sheet,i+1,"",studentInEdu300.get(i).getEdu001_ID().toString(),-1,11,false);
        }

        sheet.setColumnWidth(0, 12*256);
        sheet.setColumnWidth(1, 30*256);
        sheet.setColumnWidth(2, 4*256);
        sheet.setColumnWidth(3, 8*256);
        sheet.setColumnWidth(4, 10*256);
        sheet.setColumnWidth(5, 16*256);
        sheet.setColumnWidth(6, 10*256);
        sheet.setColumnWidth(7, 20*256);
        sheet.setColumnWidth(8, 10*256);

        sheet.setColumnHidden((short)9, true);
        sheet.setColumnHidden((short)10, true);
        sheet.setColumnHidden((short)11, true);

        CellRangeAddress region = new CellRangeAddress(0, 0, 0, 7);
        sheet.addMergedRegion(region);

        return workbook;
    }

    //校验导入考勤情况文件
    public ResultVO checkCourseCheckOnFile(MultipartFile file) {
        ResultVO resultVO;
        String fileName = file.getOriginalFilename();
        String suffix = fileName.substring(fileName.lastIndexOf(".") + 1);
        if (!"xlsx".equals(suffix) && !"xls".equals(suffix)) {
            resultVO = ResultVO.setFailed("文件格式错误");
            return resultVO;
        }
        try {
            XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
            XSSFSheet sheet = workbook.getSheet("考勤情况详情");
            int totalRows = sheet.getPhysicalNumberOfRows() - 2;
            // 遍历集合数据，产生数据行
            for (int i = 0; i < totalRows; i++) {
                int rowIndex = i + 2;
                XSSFRow contentRow = sheet.getRow(rowIndex);
                XSSFCell cell0 = contentRow.getCell(0);
                XSSFCell cell1 = contentRow.getCell(1);
                XSSFCell cell2 = contentRow.getCell(2);
                XSSFCell cell3 = contentRow.getCell(3);
                XSSFCell cell4 = contentRow.getCell(4);
                XSSFCell cell5 = contentRow.getCell(5);
                XSSFCell cell6 = contentRow.getCell(6);
                XSSFCell cell7 = contentRow.getCell(7);
                XSSFCell cell9 = contentRow.getCell(9);
                XSSFCell cell10 = contentRow.getCell(10);
                XSSFCell cell11 = contentRow.getCell(11);
                if (cell0 == null || cell1 == null || cell2 == null || cell3 == null || cell4 == null || cell5 == null || cell6 == null || cell7 == null) {
                    resultVO = ResultVO.setFailed("第"+rowIndex+"行存在空值");
                    return resultVO;
                }
                if (cell9 == null || cell10 == null || cell11 == null ) {
                    resultVO = ResultVO.setFailed("模版错误，请示使用下载的模版");
                    return resultVO;
                }
                XSSFCell cell = contentRow.getCell(8);
                if(cell != null) {
                    String data = cell.toString();
                    Boolean isFit = true;//data是否为数值型
                    if (data != null) {
                        //判断data是否为数值型
                        if (!"01".equals(data) && !"02".equals(data)) {
                            isFit = false;
                        }
                    }
                    if(!isFit) {
                        resultVO = ResultVO.setFailed("第"+rowIndex+"行考勤情况代码违规");
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


    //导入考情情况文件
    public ResultVO importCourseCheckOnFile(MultipartFile file, String lrrmc, String userKey) {
        ResultVO resultVO;
        CourseCheckOnPO checkOnPO = new CourseCheckOnPO();
        try {
            int count = 0;
            int countAll = 0;
            XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
            XSSFSheet sheet = workbook.getSheet("考勤情况详情");
            int totalRows = sheet.getPhysicalNumberOfRows() - 2;
            XSSFRow row = sheet.getRow(2);
            String edu203_id = row.getCell(9).toString();
            String edu201_id = row.getCell(10).toString();
            // 遍历集合数据，产生数据行
            for (int i = 0; i < totalRows; i++) {
                int rowIndex = i + 2;
                XSSFRow contentRow = sheet.getRow(rowIndex);
                XSSFCell dataCell = contentRow.getCell(8);
                String edu001_id = contentRow.getCell(11).toString();
                if ( dataCell != null ) {
                    EDU208 edu208 = new EDU208();
                    edu208.setEdu001_ID(Long.parseLong(edu001_id));
                    edu208.setEdu201_ID(Long.parseLong(edu201_id));
                    edu208.setEdu203_ID(Long.parseLong(edu203_id));
                    edu208.setOnCheckFlag(dataCell.toString());
                    edu208Dao.save(edu208);
                    if("01".equals(dataCell.toString())) {
                        count++;
                    }
                    countAll++;
                }
            }

            if (countAll == 0) {
                resultVO = ResultVO.setFailed("并未导入任何数据");
                return resultVO;
            }

            double v = Double.parseDouble(String.valueOf(count)) / Double.parseDouble(String.valueOf(totalRows));
            NumberFormat nf = NumberFormat.getPercentInstance();
            nf.setMinimumFractionDigits(2);//设置保留小数位
            String usedPercent = nf.format(v);
            //更新出勤率
            edu203Dao.updateAttendance(edu203_id,usedPercent);
            CourseCheckOnPO data = courseCheckOnDao.findOne(edu203_id);
            BeanUtils.copyProperties(checkOnPO,data);
        } catch (IOException | IllegalAccessException | InvocationTargetException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("导入成功",checkOnPO);
        return resultVO;
    }


    //查询详情
    public ResultVO searchCourseCheckOnDetail(String courseId) {
        return null;
    }
}
