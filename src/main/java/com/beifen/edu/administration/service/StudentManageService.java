package com.beifen.edu.administration.service;

import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

//学生管理业务层
@Service
public class StudentManageService {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    private AdministrationPageService administrationPageService;
    @Autowired
    private ApprovalProcessService approvalProcessService;
    @Autowired
    private Edu001Dao edu001Dao;
    @Autowired
    private Edu300Dao edu300Dao;
    @Autowired
    private Edu990Dao edu990Dao;
    @Autowired
    private Edu992Dao edu992Dao;
    @Autowired
    private Edu004Dao edu004Dao;


    // 查询所有学生信息
    public List<Edu001> queryAllStudent() {
        return edu001Dao.findAll();
    }

    // 新增学生是否会超过行政班容纳人数
    public boolean administrationClassesIsSpill(String edu300_ID) {
        boolean studentSpill = false;
        int nrrs = edu300Dao.queryXZBrnrs(edu300_ID);
        int counts = edu001Dao.countXzbRS(edu300_ID);

        if ((counts + 1) > nrrs && nrrs != 0) {
            studentSpill = true;
        }
        return studentSpill;
    }

    // 查询学生身份证号是否存在
    public boolean IDcardIshave(String sfzh) {
        boolean isHave = false;
        if (sfzh != null) {
            List<Edu001> IDcards = edu001Dao.IDcardIshave(sfzh);
            if (IDcards.size() > 0)
                isHave = true;
        }
        return isHave;
    }

    // 为新生生成学号
    public String getNewStudentXh(String edu300_ID) {
        String newXh = "";
        String xzbBm = edu300Dao.queryXzbByEdu300ID(edu300_ID).get(0).getXzbbm();
        List<Edu001> thisClassAllStudents = edu001Dao.queryStudentInfoByAdministrationClass(edu300_ID);
        if (thisClassAllStudents.size() != 0) {
            List<Long> currentXhs = new ArrayList<Long>();
            for (int i = 0; i < thisClassAllStudents.size(); i++) {
                currentXhs.add(Long.parseLong(thisClassAllStudents.get(i).getXh()));
            }
            int newXhSuffix = 0;
            String maxXh = String.valueOf(Collections.max(currentXhs));
            maxXh = maxXh.replace(xzbBm, "");
            newXhSuffix = Integer.parseInt(maxXh) + 1;
            if (newXhSuffix <= 9) {
                newXh = String.valueOf(xzbBm + "00" + newXhSuffix);
            } else if (newXhSuffix > 9 && newXhSuffix <= 99) {
                newXh = String.valueOf(xzbBm + "0" + newXhSuffix);
            } else {
                newXh = String.valueOf(xzbBm + newXhSuffix);
            }
        } else {
            newXh = xzbBm + "001";
        }
        return newXh;
    }

    //添新学生
    public ResultVO<Edu001> addNewStudent(Edu001 edu001) {
        ResultVO<Edu001> resultVO = new ResultVO<>();
        // 判断新增学生是否会超过行政班容纳人数
        boolean studentSpill = administrationClassesIsSpill(edu001.getEdu300_ID());
        if (studentSpill) {
            resultVO = ResultVO.setFailed("行政班容纳人数已达上限，请更换班级");
            return resultVO;
        }
        // 判断身份证是否存在
        boolean IDcardIshave = IDcardIshave(edu001.getSfzh());
        if (IDcardIshave) {
            resultVO = ResultVO.setFailed("身份证号重复，请确认后重新输入");
            return resultVO;
        }

        String newXh = getNewStudentXh(edu001.getEdu300_ID()); //新生的学号
        String yxbz = "1";
        edu001.setYxbz(yxbz);
        edu001.setXh(newXh);
        addStudent(edu001); // 新增学生
        administrationPageService.addAdministrationClassesZXRS(edu001.getEdu300_ID());
        resultVO = ResultVO.setSuccess("新增学生成功",edu001);

        return resultVO;
    }

    // 新增学生
    public void addStudent(Edu001 edu001) {
        edu001Dao.save(edu001);

        Edu990 edu990 = new Edu990();
        edu990.setYhm("s" + edu001.getXh());
        edu990.setMm("123456");
        edu990.setUserKey(edu001.getEdu001_ID().toString());
        edu990Dao.save(edu990);

        Edu992 edu992 = new Edu992();
        edu992.setBF990_ID(edu990.getBF990_ID());
        edu992.setBF991_ID(Long.parseLong("8050"));
        edu992Dao.save(edu992);
    }


    // 删除学生
    public ResultVO removeStudentByID(JSONArray deleteArray) {
        ResultVO resultVO = new ResultVO();
        Integer count = 0;
        for (int i = 0; i < deleteArray.size(); i++) {
            JSONObject jsonObject = deleteArray.getJSONObject(i);
            String edu300_ID = jsonObject.getString("edu300_ID");
            Long studentId = jsonObject.getLong("studentId");
            edu001Dao.removeStudentByID(studentId);
            edu300Dao.ZxrsMinusOne(edu300_ID);
            count++;
        }
        resultVO = ResultVO.setSuccess("成功删除了"+count+"个学生");
        return resultVO;

    }

    // 修改学生时修改了行政班的情况
    public void updateStudent(Edu001 newStudentInfo) {
        // 新行政班人数加一
        administrationPageService.addAdministrationClassesZXRS(newStudentInfo.getEdu300_ID());

        // 旧行政班未被删除则旧行政班人数减一
        String oldXZB = queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
        if (oldXZB != null) {
            String oldXZBId = edu001Dao.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
            administrationPageService.cutAdministrationClassesZXRS(oldXZBId);
        }

        // 修改学生
        edu001Dao.save(newStudentInfo);
    }

    // 根据id查询学生信息
    public Edu001 queryStudentBy001ID(String edu001Id) {
        return edu001Dao.queryStudentBy001ID(edu001Id);
    }

    //根据id查学生学号
    public String queryXhBy001ID(String edu001_ID) {
        return edu001Dao.queryXhBy001ID(edu001_ID);
    }

    // 批量发放毕业证
    public ResultVO graduationStudents(com.alibaba.fastjson.JSONArray graduationArray) {
        ResultVO resultVO;
        Integer count = 0;
        for (int i = 0; i < graduationArray.size(); i++) {
            edu001Dao.graduationStudents(graduationArray.get(i).toString());
            count++;
        }
        resultVO = ResultVO.setSuccess("成功发放了"+count+"个毕业证");
        return resultVO;
    }

    // 学生管理搜索学生
    public ResultVO studentMangerSearchStudent(Edu001 edu001) {
        Specification<Edu001> specification = new Specification<Edu001>() {
            public Predicate toPredicate(Root<Edu001> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu001.getPycc() != null && !"".equals(edu001.getPycc())) {
                    predicates.add(cb.equal(root.<String> get("pycc"), edu001.getPycc()));
                }
                if (edu001.getSzxb() != null && !"".equals(edu001.getSzxb())) {
                    predicates.add(cb.equal(root.<String> get("szxb"), edu001.getSzxb()));
                }
                if (edu001.getNj() != null && !"".equals(edu001.getNj())) {
                    predicates.add(cb.equal(root.<String> get("nj"), edu001.getNj()));
                }
                if (edu001.getZybm() != null && !"".equals(edu001.getZybm())) {
                    predicates.add(cb.equal(root.<String> get("zybm"), edu001.getZybm()));
                }
                if (edu001.getEdu300_ID() != null && !"".equals(edu001.getEdu300_ID())) {
                    predicates.add(cb.equal(root.<String> get("Edu300_ID"), edu001.getEdu300_ID()));
                }
                if (edu001.getZtCode() != null && !"".equals(edu001.getZtCode())) {
                    predicates.add(cb.equal(root.<String> get("ztCode"), edu001.getZtCode()));
                }
                if (edu001.getXjh() != null && !"".equals(edu001.getXjh())) {
                    predicates.add(cb.like(root.<String> get("xjh"), '%' + edu001.getXjh() + '%'));
                }
                if (edu001.getXh() != null && !"".equals(edu001.getXh())) {
                    predicates.add(cb.like(root.<String> get("xh"), '%' + edu001.getXh() + '%'));
                }
                if (edu001.getXm() != null && !"".equals(edu001.getXm())) {
                    predicates.add(cb.like(root.<String> get("xm"), '%' + edu001.getXm() + '%'));
                }
                if (edu001.getXzbname() != null && !"".equals(edu001.getXzbname())) {
                    predicates.add(cb.like(root.<String> get("xzbname"), '%' + edu001.getXzbname() + '%'));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu001> classesEntities = edu001Dao.findAll(specification);
        ResultVO resultVO = ResultVO.setSuccess("共找到"+classesEntities.size()+"个学生",classesEntities);
        return resultVO;
    }

    // 查询学生所在行政班ID
    public String queryStudentXzbCode(String edu001Id) {
        return edu001Dao.queryStudentXzbCode(edu001Id);
    }


    public ResultVO modifyStudent(Edu001 edu001, Edu600 edu600) {
        ResultVO resultVO = new ResultVO();
        List<Edu001> currentAllStudent = queryAllStudent();
        // 判断身份证是否存在
        boolean IdcardHave= false;
        for (int i = 0; i < currentAllStudent.size(); i++) {
            if (!currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())
                    && currentAllStudent.get(i).getSfzh().equals(edu001.getSfzh())) {
                IdcardHave = true;
                break;
            }
        }
        if(IdcardHave) {
            resultVO = ResultVO.setFailed("身份证号重复，请确认后重新输入");
            return resultVO;
        }


        // 判断是否改变行政班
        boolean isChangeXZB = false;
        for (int i = 0; i < currentAllStudent.size(); i++) {
            if (currentAllStudent.get(i).getEdu001_ID().equals(edu001.getEdu001_ID())) {
                if (currentAllStudent.get(i).getEdu300_ID() == null
                        || currentAllStudent.get(i).getEdu300_ID().equals("")) {
                    isChangeXZB = true;
                    break;
                } else {
                    if (!currentAllStudent.get(i).getEdu300_ID().equals(edu001.getEdu300_ID())) {
                        isChangeXZB = true;
                        break;
                    }
                }
            }
        }


        // 不存在则修改学生
        if (!IdcardHave) {
            //如果修改操作为修改学生状态为休学 发送审批流对象
            Edu001 oldEdu001 = queryStudentBy001ID(edu001.getEdu001_ID().toString());
            if(edu001.getZtCode().equals("002") && !"002".equals(oldEdu001.getZtCode())){
                edu001.setZtCode("007");
                edu001.setZt("休学申请中");
                edu600.setBusinessKey(edu001.getEdu001_ID());
            }
            if (!isChangeXZB) {
               edu001Dao.save(edu001);
            } else {
                // 判断修改是否会超过行政班容纳人数
                boolean studentSpill = administrationClassesIsSpill(edu001.getEdu300_ID());
                if(studentSpill){
                    resultVO = ResultVO.setFailed("行政班容纳人数已达上限，请更换班级");
                    return resultVO;
                } else {
                    updateStudent(edu001);
                }
            }
            approvalProcessService.initiationProcess(edu600);
        }
        resultVO = ResultVO.setSuccess("学生信息修改成功",edu001);

        return resultVO;
    }


    /**
     * 批量导入学生
     * @param file
     * @return
     */
    public ResultVO importStudent(MultipartFile file){
        ResultVO resultVO = new ResultVO();
        Map<String, Object> returnMap = null;
        try {
            returnMap = utils.checkStudentFile(file, "ImportEdu001", "导入学生信息");
        } catch (Exception e) {
            e.printStackTrace();
            resultVO = ResultVO.setFailed("导入失败");
            return resultVO;
        }

        boolean modalPass = (boolean) returnMap.get("modalPass");
        if (!modalPass) {
            resultVO = ResultVO.setFailed("模版错误，导入失败",returnMap);
            return resultVO;
        }

        if(!returnMap.get("dataCheck").equals("")){
            boolean dataCheck = (boolean) returnMap.get("dataCheck");
            if (!dataCheck) {
                resultVO = ResultVO.setFailed("数据格式有误，请修改后重试",returnMap);
                return resultVO;
            }
        }

        Integer count = 0;
        if(!returnMap.get("importStudent").equals("")){
            List<Edu001> importStudent = (List<Edu001>) returnMap.get("importStudent");
            String yxbz = "1";
            for (int i = 0; i < importStudent.size(); i++) {
                Edu001 edu001 = importStudent.get(i);
                edu001.setYxbz(yxbz);
                edu001.setXh(getNewStudentXh(edu001.getEdu300_ID())); //新生的学号
                addStudent(edu001); // 新增学生
                count++;
            }
            resultVO = ResultVO.setSuccess("成功导入了"+count+"个学生",importStudent);
        }

        return resultVO;
    }

    /**
     * 批量修改学生
     * @param file
     * @param edu600
     * @return
     */
    public ResultVO modifyStudents(MultipartFile file, Edu600 edu600) {
        ResultVO resultVO = new ResultVO();
        Map<String, Object> returnMap = null;
        try {
            returnMap = utils.checkStudentFile(file, "ModifyEdu001", "已选学生信息");
        } catch (Exception e) {
            e.printStackTrace();
            resultVO = ResultVO.setFailed("修改失败");
            return resultVO;
        }
        boolean modalPass = (boolean) returnMap.get("modalPass");
        if (!modalPass) {
            resultVO = ResultVO.setFailed("修改失败",returnMap);
            return resultVO;
        }

        if(!returnMap.get("dataCheck").equals("")){
            boolean dataCheck = (boolean) returnMap.get("dataCheck");
            if (!dataCheck) {
                resultVO = ResultVO.setFailed("修改失败",returnMap);
                return resultVO;
            }
        }

        Integer count = 0;
        if(!returnMap.get("importStudent").equals("")){
            List<Edu001> modifyStudents = (List<Edu001>) returnMap.get("importStudent");
            for (int i = 0; i < modifyStudents.size(); i++) {
                //如果修改操作为修改学生状态为休学 发送审批流对象
                Edu001 oldEdu001 = queryStudentBy001ID(modifyStudents.get(i).getEdu001_ID().toString());
                if(modifyStudents.get(i).getZtCode().equals("002") && !"002".equals(oldEdu001.getZtCode())){
                    modifyStudents.get(i).setZtCode("007");
                    modifyStudents.get(i).setZt("休学申请中");
                    edu600.setBusinessKey(modifyStudents.get(i).getEdu001_ID());
                }
                updateStudent(modifyStudents.get(i)); //修改学生
                approvalProcessService.initiationProcess(edu600);
                count++;
            }
            resultVO = ResultVO.setSuccess("成功修改了"+count+"个学生",modifyStudents);
        }

        return resultVO;
    }

    //查询学生评价
    public ResultVO queryStudentAppraise(String edu001Id) {
        ResultVO resultVO;
        Edu004  edu004 = edu004Dao.findAppraiseByStudentId(edu001Id);
        if (edu004.getEdu001_ID() == null) {
            resultVO = ResultVO.setFailed("此学生暂无评价");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu004);
        }
        return resultVO;
    }


    public ResultVO studentAppraise(List<String> studnetIdList, String appraiseInfo) {
        ResultVO resultVO;

        for (String s : studnetIdList) {
            Edu004 one = edu004Dao.findAppraiseByStudentId(s);
            if (one.getEdu001_ID() != null) {
                one.setAppraiseText(appraiseInfo);
                edu004Dao.save(one);
            } else {
                Edu004 edu004 = new Edu004();
                edu004.setEdu001_ID(Long.parseLong(s));
                edu004.setAppraiseText(appraiseInfo);
                edu004Dao.save(edu004);
            }
        }

        resultVO = ResultVO.setSuccess("成功评价了"+studnetIdList.size()+"个学生");
        return resultVO;
    }
}
