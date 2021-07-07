package com.beifen.edu.administration.service;

import com.beifen.edu.administration.PO.BigDataTeacherTypePO;
import com.beifen.edu.administration.PO.CheckOnDetailPO;
import com.beifen.edu.administration.PO.CourseCheckOnPO;
import com.beifen.edu.administration.PO.CourseGradeViewPO;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
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
    Edu400Dao edu400Dao;
    @Autowired
    Edu0051Dao edu0051Dao;
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
    Edu008Dao edu008Dao;
    @Autowired
    Edu999Dao edu999DAO;
    @Autowired
    ApprovalProcessService approvalProcessService;
    @Autowired
    CourseCheckOnDao courseCheckOnDao;
    @Autowired
    RedisUtils redisUtils;
    @Autowired
    Edu115Dao edu115Dao;
    @Autowired
    CourseGradeViewDao courseGradeViewDao;


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
        String newXh = "";
        for(;;){
            String jzgh_before =utils.getRandom(2);
            newXh = "1"+jzgh_before+utils.getRandom(3);
            String s = edu101Dao.queryJzghSFCZ(newXh);
            if("0".equals(s)){
                break;
            }
        }
        return newXh;
    }


    //根据权限查询所有教师
    public ResultVO queryAllTeacherByUserId(String userId) {
        ResultVO resultVO;

        //从redis中查询二级学院管理权限
//        List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

        List<Edu101> teacherList = edu101Dao.queryAllTeacherByUserId();

        if(teacherList.size() == 0) {
            resultVO = ResultVO.setFailed("暂无教师信息");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+teacherList.size()+"个教师",teacherList);
        }

        return resultVO;
    }



    //查询需要录入成绩学生
    public List<Edu005> queryGrades2(String userId) {
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();

        //查询教师任务书ID列表
        List<String> edu201IdList = edu205Dao.findEdu201IdByTeacher(userKey);
        if(edu201IdList.size() == 0) {
            return null;
        }

        //根据条件筛选培养计划
        Specification<Edu107> specification = new Specification<Edu107>() {
            public Predicate toPredicate(Root<Edu107> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu107> edu107List = edu107Dao.findAll(specification);
        if (edu107List.size() == 0) {
            return null;
        }
        List<Long> edu107IdList = edu107List.stream().map(e -> e.getEdu107_ID()).distinct().collect(Collectors.toList());
        List<Long> edu108IdList = edu108Dao.getEdu108ByEdu107(edu107IdList);
        if (edu108IdList.size() == 0) {
            return null;
        }
        List<String> edu201Ids = edu201Dao.getTaskByEdu108Ids(edu108IdList);
        //两个201id集合去交集
        edu201IdList.retainAll(edu201Ids);
        if(edu201IdList.size() == 0) {
            return null;
        }

        List edu201ids = utils.heavyListMethod(edu201IdList);

        //根据条件筛选成绩表
        Specification<Edu005> edu005Specification = new Specification<Edu005>() {
            public Predicate toPredicate(Root<Edu005> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
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
            return null;
        }
        return edu005List;
    }

    public ResultVO searchCourseGetGradeByTeacher(String userId){
        ResultVO resultVO;
        String userKey = edu990Dao.findOne(Long.parseLong(userId)).getUserKey();
        List<CourseGradeViewPO> courseGradeViewPOList = courseGradeViewDao.searchCourseGetGradeByTeacher(userKey);
        if(courseGradeViewPOList.size() == 0){
            resultVO = ResultVO.setFailed("暂无需要成绩确认的班级");
        }else{
            resultVO = ResultVO.setSuccess("共"+courseGradeViewPOList.size()+"个需要成绩确认的班级",courseGradeViewPOList);
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
                query.orderBy(cb.desc(root.get("className")));
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
        if(edu005.getIsMx() != null && !edu005.getIsMx().equals("0")){
            if(edu005.getIsMx().equals("01")){
                edu005.setGetCredit(edu005.getCredit());
                edu005.setIsPassed("T");
            }else{
                edu005.setIsPassed("F");
            }
        }else{
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
            } if("T".equals(edu005.getIsResit())){
                if(edu005.getExam_num() == null){
                    edu005.setExam_num(1);
                }else{
                    edu005.setExam_num(edu005.getExam_num()+1);
                }
            }
        }
        edu005Dao.save(edu005);
        if("T".equals(edu005.getIsResit()) && "T".equals(edu005.getIsConfirm())){
            Edu0051 edu0051 = new Edu0051();
            edu0051.setEdu005_ID(edu005.getEdu005_ID());
            edu0051.setEdu001_ID(edu005.getEdu001_ID());
            edu0051.setEdu201_ID(edu005.getEdu201_ID());
            edu0051.setEdu300_ID(edu005.getEdu300_ID());
            edu0051.setEdu101_ID(edu005.getEdu101_ID());
            edu0051.setCourseName(edu005.getCourseName());
            edu0051.setClassName(edu005.getClassName());
            edu0051.setStudentName(edu005.getStudentName());
            edu0051.setStudentCode(edu005.getStudentCode());
            edu0051.setGradeEnter(edu005.getGradeEnter());
            edu0051.setEntryDate(edu005.getEntryDate());
            edu0051.setGrade(edu005.getGrade());
            edu0051.setXnid(edu005.getXnid());
            edu0051.setXn(edu005.getXn());
            edu0051.setExam_num(edu005.getExam_num());
            edu0051Dao.save(edu0051);
        }
        resultVO = ResultVO.setSuccess("成绩录入成功",edu005);
        return resultVO;
    }


    //查询所有老师
    public ResultVO queryAllTeachers() {
        ResultVO resultVO;
        List<Edu101> edu101List = edu101Dao.findAllteachers();
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
            XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
            XSSFSheet sheet = workbook.getSheet("考勤情况详情");
            int totalRows = sheet.getPhysicalNumberOfRows() - 2;
            XSSFRow row = sheet.getRow(2);
            String edu203_id = row.getCell(9).toString();
            String edu201_id = row.getCell(10).toString();

            //删除原有数据
            edu208Dao.deleteByEdu203Id(edu203_id);

            // 遍历集合数据，产生数据行
            for (int i = 0; i < totalRows; i++) {
                int rowIndex = i + 2;
                XSSFRow contentRow = sheet.getRow(rowIndex);
                XSSFCell dataCell = contentRow.getCell(8);
                String edu001_id = contentRow.getCell(11).toString();

                EDU208 edu208 = new EDU208();
                edu208.setEdu001_ID(Long.parseLong(edu001_id));
                edu208.setEdu201_ID(Long.parseLong(edu201_id));
                edu208.setEdu203_ID(Long.parseLong(edu203_id));
                if ( dataCell != null ) {
                    edu208.setOnCheckFlag(dataCell.toString());
                    if("01".equals(dataCell.toString())) {
                        count++;
                    }
                }
                edu208Dao.save(edu208);

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
        ResultVO resultVO;
        List<Object[]> dataList = edu208Dao.findAllByEdu203ID(courseId);
        if(dataList.size() == 0) {
            resultVO = ResultVO.setFailed("该课节未找到考勤记录");
            return resultVO;
        }
        CheckOnDetailPO checkOnDetailPO = new CheckOnDetailPO();
        List<CheckOnDetailPO> newCheckOnDetailPO = utils.castEntity(dataList, CheckOnDetailPO.class, checkOnDetailPO);

        resultVO = ResultVO.setSuccess("共找到"+newCheckOnDetailPO.size()+"个学生",newCheckOnDetailPO);
        return resultVO;
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


    //确认成绩并生成补考标识
    public ResultVO confirmGrade(Edu005 edu005, String userKey) {
        ResultVO resultVO;


        if (edu005.getXnid() != null && !"".equals(edu005.getXnid())) {
            Edu400 edu400 = edu400Dao.getTermInfoById(edu005.getXnid());
            if(edu400 != null){
                String lrsj = edu400.getLrsj();
                if(lrsj != null && !"".equals(lrsj)){
                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");//注意月份是MM
                    try {
                        Date lrsjDate = simpleDateFormat.parse(lrsj);
                        Date now = new Date();
                        int compareTo = lrsjDate.compareTo(now);
                        if(compareTo != 1){
                            Edu115 edu115 = edu115Dao.queryBySearch(edu005.getClassName(),edu005.getCourseName(),edu005.getXnid());
                            if(edu115 == null){
                                resultVO =  ResultVO.setDateFailed("录入时间超过截至日期");
                                return resultVO;
                            }else if("nopass".equals(edu115.getBusinessState())){
                                resultVO =  ResultVO.setFailed("已提交延迟确认成绩申请，请等待上级审批！");
                                return resultVO;
                            }

                        }
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
        }


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
                predicates.add(cb.isNull(root.<String>get("isConfirm")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };


        List<Edu005> edu005List = edu005Dao.findAll(edu005Specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到可确认的课程或该课程已经进行过确认操作");
            return resultVO;
        }

        Long edu201_id = edu005List.get(0).getEdu201_ID();
        Edu205 edu205 = edu205Dao.findExist(userKey,edu201_id);

        if (edu205 == null) {
            resultVO = ResultVO.setFailed("您不是该课程的老师无法确认成绩");
            return resultVO;
        }

        List<Long> confirmIdList = edu005List.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());

        List<Edu005> edu005ss = edu005Dao.findConfirmGrade(confirmIdList);
        if(edu005ss.size()>0){
            Edu005 e = edu005ss.get(0);
            resultVO = ResultVO.setFailed("【"+e.getCourseName()+"】课程，该学生【"+e.getStudentName()+"】成绩未录入！");
            return resultVO;
        }


        edu005Dao.updateConfirmGrade(confirmIdList);

        String param = "courseName:"+edu005.getCourseName()+",xnid:"+edu005.getXnid()+",className:"+edu005.getClassName();
        addLog(userKey,"confirmGrade",param);

        Specification<Edu005> newSpecification = new Specification<Edu005>() {
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
                    predicates.add(cb.isNotNull(root.<String>get("isPassed")));
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005s = edu005Dao.findAll(newSpecification);

        Map<String, List<Edu005>> passMap = edu005s.stream().collect(Collectors.groupingBy(Edu005::getIsPassed, Collectors.toList()));

        passMap.forEach((key,value) -> {
            if("F".equals(key)) {
                List<Long> noPassIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
                edu005Dao.updateResitFlag(noPassIdList,"T");
            } else if ("T".equals(key)) {
                List<Long> passIdList = value.stream().map(Edu005::getEdu005_ID).collect(Collectors.toList());
                edu005Dao.updateResitFlag(passIdList,"F");
            }
        });

        //根据条件筛选成绩表
        Specification<Edu005> specification = new Specification<Edu005>() {
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
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> newEdu005List = edu005Dao.findAll(specification);

        for(int i = 0;i < newEdu005List.size();i++){
            Edu005 e005 = newEdu005List.get(i);
            if("T".equals(e005.getIsResit()) && "T".equals(e005.getIsConfirm()) && e005.getGrade()!=null){
                Edu0051 edu0051 = new Edu0051();
                edu0051.setEdu005_ID(e005.getEdu005_ID());
                edu0051.setEdu001_ID(e005.getEdu001_ID());
                edu0051.setEdu201_ID(e005.getEdu201_ID());
                edu0051.setEdu300_ID(e005.getEdu300_ID());
                edu0051.setEdu101_ID(e005.getEdu101_ID());
                edu0051.setCourseName(e005.getCourseName());
                edu0051.setClassName(e005.getClassName());
                edu0051.setStudentName(e005.getStudentName());
                edu0051.setStudentCode(e005.getStudentCode());
                edu0051.setGradeEnter(e005.getGradeEnter());
                edu0051.setEntryDate(e005.getEntryDate());
                edu0051.setGrade(e005.getGrade());
                edu0051.setXnid(edu005.getXnid());
                edu0051.setXn(edu005.getXn());
                edu0051.setExam_num(0);
                edu0051Dao.save(edu0051);
            }
        }

        resultVO = ResultVO.setSuccess("成绩确认成功",newEdu005List);

        return resultVO;
    }


    //成绩取消确认
    public ResultVO cancelGrade(Edu005 edu005, Edu600 edu600) {
        ResultVO resultVO;

        Specification<Edu005> specification = new Specification<Edu005>() {
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
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };

        List<Edu005> edu005List = edu005Dao.findAll(specification);

        if (edu005List.size() == 0) {
            resultVO = ResultVO.setFailed("未找到符合条件的成绩，请确认后重新输入");
            return resultVO;
        }

        //根据任务书查询二级学院代码
        Long edu201_id = edu005List.get(0).getEdu201_ID();
        Edu201 edu201 = edu201Dao.findOne(edu201_id);
        Edu108 edu1081 = edu108Dao.findOne(edu201.getEdu108_ID());
        Edu107 edu1071 = edu107Dao.findOne(edu1081.getEdu107_ID());
        String departmentCode = edu1071.getEdu104();

        //添加取消确认成绩信息表
        Edu008 edu008 = new Edu008();
        edu008.setXnid(edu005.getXnid());
        edu008.setXn(edu005.getXn());
        edu008.setClassName(edu005.getClassName());
        edu008.setCourseName(edu005.getCourseName());
        edu008.setXnid(edu005.getXnid());
        edu008.setDepartmentCode(departmentCode);
        edu008Dao.save(edu008);

        //设置业务主键并发起审批
        edu600.setBusinessKey(edu008.getEdu008_ID());
        boolean isSuccess = approvalProcessService.initiationProcess(edu600);

        if (isSuccess) {
            resultVO = ResultVO.setSuccess("审批发起成功");
        } else {
            edu008Dao.delete(edu008.getEdu008_ID());
            resultVO = ResultVO.setFailed("审批流程发起失败，请联系管理员");
        }

        return resultVO;
    }


    //取消成绩确认标识和补考标识
    public void cancelGradeInfo(String edu008Id) {
        Edu008 edu008 = edu008Dao.findOne(Long.parseLong(edu008Id));
        List<String> Edu005Ids = edu005Dao.cancelGradeInfoQuery(edu008.getXnid(),edu008.getCourseName(),edu008.getClassName());
        //删除补考成绩表
        edu0051Dao.deleteEdu0051sByEdu005Id(Edu005Ids);
        //修改正考数据 （已得学分（getCredit），是否补考，是否确认，补考次数（exam_num））
        edu005Dao.cancelGradeInfo(edu008.getXnid(),edu008.getCourseName(),edu008.getClassName());
    }

    //更新教师信息
    public ResultVO updateTeacher(Edu101 edu101) {
        ResultVO resultVO;
        Edu101 e = edu101Dao.findOne(edu101.getEdu101_ID());
        String s = e.getJzgh();
        if(s.equals(edu101.getJzgh())){
            edu101Dao.save(edu101);
            resultVO = ResultVO.setSuccess("修改成功");
            return resultVO;
        }
        String num = edu101Dao.queryJzghSFCZ(edu101.getJzgh());
        if (!"0".equals(num)){
            resultVO = ResultVO.setFailed("教职工号重复，请重新修改！");
            return resultVO;
        }
        Edu990 e990 = edu990Dao.checkIsHaveUser(edu101.getJzgh());
        if(e990 != null){
            resultVO = ResultVO.setFailed("教职工号与其他用户账号重复，请重新修改！");
            return resultVO;
        }

        Edu990 e9901 = edu990Dao.getUserInfo(s);
        e9901.setYhm(edu101.getJzgh());
        edu990Dao.save(e9901);
        edu101Dao.save(edu101);
        resultVO = ResultVO.setSuccess("修改成功");
        return resultVO;
    }
}
