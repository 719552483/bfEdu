package com.beifen.edu.administration.service;

import com.beifen.edu.administration.dao.Edu101Dao;
import com.beifen.edu.administration.dao.Edu201Dao;
import com.beifen.edu.administration.dao.Edu990Dao;
import com.beifen.edu.administration.dao.Edu992Dao;
import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu201;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.domian.Edu992;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

//教职工管理业务层
@Service
public class StaffManageService {

    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu201Dao edu201Dao;
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    ApprovalProcessService approvalProcessService;


    ReflectUtils utils = new ReflectUtils();



    //新增教师
    public void addTeacher(Edu101 edu101) {
        edu101Dao.save(edu101);

        Edu990 edu990 = new Edu990();
        edu990.setYhm("t" + edu101.getJzgh());
        edu990.setMm("123456");
        edu990.setUserKey(edu101.getEdu101_ID().toString());
        edu990Dao.save(edu990);

        Edu992 edu992 = new Edu992();
        edu992.setBF990_ID(edu990.getBF990_ID());
        edu992.setBF991_ID(Long.parseLong("8051"));
        edu992Dao.save(edu992);
    }

    // 根据id查询教师姓名
    public String queryTecaherNameById(Long techerId) {
        return edu101Dao.queryTeacherById(techerId);
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
        String newXh = "";
        List<Edu101> allTeacher = edu101Dao.findAll();
        if (allTeacher.size() != 0) {
            List<Long> currentjzghs = new ArrayList<Long>();
            for (int i = 0; i < allTeacher.size(); i++) {
                currentjzghs.add(Long.parseLong(allTeacher.get(i).getJzgh().substring(2, allTeacher.get(i).getJzgh().length())));
            }
            int newXhSuffix = 0;
            String maxjzgh = String.valueOf(Collections.max(currentjzghs));
            newXhSuffix = Integer.parseInt(maxjzgh) + 1;
            if (newXhSuffix <= 9) {
                newXh = jzgh_before + "00" +  newXhSuffix;
            } else if (newXhSuffix > 9 && newXhSuffix <= 99) {
                newXh = jzgh_before + "0" +  newXhSuffix;
            } else {
                newXh = jzgh_before + newXhSuffix;
            }
        } else {
            newXh = jzgh_before + "001";
        }
        return newXh;
    }
}
