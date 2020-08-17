package com.beifen.edu.administration.service;

import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.Edu001;
import com.beifen.edu.administration.domian.Edu301;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.domian.Edu992;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class StudentManageService {

    @Autowired
    private AdministrationPageService administrationPageService;
    @Autowired
    private Edu001Dao edu001Dao;
    @Autowired
    private Edu300Dao edu300Dao;
    @Autowired
    private Edu990Dao edu990Dao;
    @Autowired
    private Edu992Dao edu992Dao;
    @Autowired
    private Edu301Dao edu301Dao;


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
        List<Edu301> teachingClassesBy300id = administrationPageService.queryTeachingClassByXzbCode(edu001.getEdu300_ID());
        String xzbid = edu001.getEdu300_ID();
        addStudentUpdateCorrelationInfo(teachingClassesBy300id, xzbid);
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

    // 新增学生时改变相关信息
    public void addStudentUpdateCorrelationInfo(List<Edu301> teachingClassesBy300id, String edu300Id) {
        // 改变行政班人数
        administrationPageService.addAdministrationClassesZXRS(edu300Id);

        // 行政班如果生成了教学班并且是以教学班划分
        if (teachingClassesBy300id.size() != 0 && teachingClassesBy300id.size() != 0) {
            for (int i = 0; i < teachingClassesBy300id.size(); i++) {
                administrationPageService.addTeachingClassesJXBRS(teachingClassesBy300id.get(i).getEdu301_ID().toString());
                edu001Dao.stuffStudentTeachingClassInfoBy300id(teachingClassesBy300id.get(i).getJxbmc(),
                        teachingClassesBy300id.get(i).getEdu301_ID(), edu300Id);
            }
        }

        // 行政班如果生成了教学班并且是以学生划分的话 则该学生只有行政班信息没有教学班信息
    }

    // 删除学生时改变相关信息
    public void removeStudentUpdateCorrelationInfo(List<Edu301> teachingClassesBy300id,
                                                   List<Edu301> teachingClassesBy001id, String edu300_ID, long studentId) {
        // 改变行政班人数
        administrationPageService.cutAdministrationClassesZXRS(edu300_ID);

        // 学生有教学班
        // 1.教学班以行政班划分
        if (teachingClassesBy300id.size() != 0) {
            for (int i = 0; i < teachingClassesBy300id.size(); i++) {
                administrationPageService.cutTeachingClassesJXBRS(teachingClassesBy300id.get(i).getEdu301_ID().toString());
            }
        } else if (teachingClassesBy001id.size() != 0) {
            // 2.教学班以学生划分
            for (int i = 0; i < teachingClassesBy001id.size(); i++) {
                List<String> oldBbhxsList = Arrays.asList(teachingClassesBy001id.get(i).getBhxsCode().split(","));
                // 教学班人数减一
                for (int o = 0; o < oldBbhxsList.size(); o++) {
                    if (oldBbhxsList.get(o).equals(String.valueOf(studentId))) {
                        administrationPageService.cutTeachingClassesJXBRS(teachingClassesBy001id.get(i).getEdu301_ID().toString());
                    }
                }

                String newBbhxsId = "";
                for (int o2 = 0; o2 < oldBbhxsList.size(); o2++) {
                    // 如果教学班包含学生id中有删除学生的id 则删除
                    if (!oldBbhxsList.get(o2).equals(String.valueOf(studentId))) {
                        newBbhxsId += oldBbhxsList.get(o2) + ",";
                    }
                }
                edu301Dao.updateJXBbhxsInfo(newBbhxsId, teachingClassesBy001id.get(i).getEdu301_ID()); // 更新教学班包含学生字段
            }
        }
    }

    // 删除学生
    public void removeStudentByID(long studentId) {
        edu001Dao.removeStudentByID(studentId);
    }

    // 修改学生时修改了行政班的情况
    public void updateStudent(Edu001 newStudentInfo) {
        // 新行政班人数加一
        administrationPageService.addAdministrationClassesZXRS(newStudentInfo.getEdu300_ID());

        // 新行政班有无教学班
        List<Edu301> newXZBofJXB = edu301Dao.queryTeachingClassByXzbCode(newStudentInfo.getEdu300_ID());
        if (newXZBofJXB.size() != 0) {
            // 新行政班有教学班并且是以行政班划分 则该教学班人数加一并更新学生教学班相关信息
            for (int i = 0; i < newXZBofJXB.size(); i++) {
                administrationPageService.addTeachingClassesJXBRS(newXZBofJXB.get(i).getEdu301_ID().toString());
            }

            // 新行政班有教学班并且是以学生划分 则不处理
        }

        // 旧行政班未被删除则旧行政班人数减一
        String oldXZB = queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
        if (oldXZB != null) {
            String oldXZBId = edu001Dao.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
            administrationPageService.cutAdministrationClassesZXRS(oldXZBId);
        }

        // 旧行政班有无教学班
        String oldXZBofThisStuden = edu001Dao.queryStudentXzbCode(newStudentInfo.getEdu001_ID().toString());
        List<Edu301> oldXZBofJXB = edu301Dao.queryTeachingClassByXzbCode(oldXZBofThisStuden);

        if (oldXZBofJXB.size() != 0) {
            // 旧行政班有教学班并且是以行政班划分 则该教学班人数减一
            for (int i = 0; i < oldXZBofJXB.size(); i++) {
                administrationPageService.cutTeachingClassesJXBRS(oldXZBofJXB.get(i).getEdu301_ID().toString());
            }

            // 旧行政班有教学班并且是以学生划分 则不处理
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
    public void graduationStudents(String edu001Id) {
        edu001Dao.graduationStudents(edu001Id);
    }

    // 学生管理搜索学生
    public List<Edu001> studentMangerSearchStudent(Edu001 edu001) {
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
        return classesEntities;
    }

    // 查询学生所在行政班ID
    public String queryStudentXzbCode(String edu001Id) {
        return edu001Dao.queryStudentXzbCode(edu001Id);
    }


}
