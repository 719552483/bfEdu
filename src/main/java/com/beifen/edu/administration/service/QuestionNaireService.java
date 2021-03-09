package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.Edu801PO;
import com.beifen.edu.administration.PO.Edu802PO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONArray;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;


//调查问卷业务层
@Service
public class QuestionNaireService {

    @Autowired
    Edu801Dao edu801Dao;
    @Autowired
    Edu802Dao edu802Dao;
    @Autowired
    Edu803Dao edu803Dao;
    @Autowired
    Edu804Dao edu804Dao;
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu001Dao edu001Dao;



//    ReflectUtils utils = new ReflectUtils();

    /**
     * 查询所有调查问卷
     * @return
     */
    public ResultVO searchAllQuestion() {
        ResultVO resultVO;
        List<Edu801> edu801List = edu801Dao.findAll();
        if(edu801List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无调查问卷");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu801List.size()+"个调查问卷",edu801List);
        }
        return resultVO;
    }

    /**
     * 根据用户id查询所有调查问卷
     * @return
     */
    public ResultVO searchAllQuestionByUserId(String userId) {
        ResultVO resultVO;
        Edu990 edu990 = edu990Dao.findOne(Long.parseLong(userId));
        List<Edu801> edu801List = new ArrayList<Edu801>();
        if("学生".equals(edu990.getJs())){
            Edu001 edu001 = edu001Dao.findOne(Long.parseLong(edu990.getUserKey()));
            String szxb = edu001.getSzxb();
            List<String> s = Arrays.asList(szxb.split(","));
            edu801List = edu801Dao.searchAllQuestionByUserId(s);
        }else{
//            List<String> s = Arrays.asList(edu990.getDeparmentIds().split(","));
//            edu801List = edu801Dao.searchAllQuestionByUserId(s);
            edu801List = edu801Dao.findAll();
        }
        if(edu801List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无调查问卷");
        } else {
            resultVO = ResultVO.setSuccess("共找到"+edu801List.size()+"个调查问卷",edu801List);
        }
        return resultVO;
    }



    /**
     * 开始答题
     * @return
     */
    public ResultVO questionsAnswer(String edu801Id,String userId) {
        ResultVO resultVO;
        String ids = edu804Dao.questionsAnswer(userId);
        if(ids != null){
            List<String> idList = Arrays.asList(ids.split(","));
            if(idList.contains(edu801Id)){
                resultVO = ResultVO.setFailed("该调查问卷答过!");
                return resultVO;
            }
        }
        Edu801 edu801 = edu801Dao.findOne(Long.parseLong(edu801Id));
        Edu801PO edu801PO = new Edu801PO();
        if(edu801 == null){
            resultVO = ResultVO.setFailed("该调查问卷已被删除，请刷新后重试");
        }else{
            try {
                BeanUtils.copyProperties(edu801PO, edu801);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
            List<Edu802> edu802List = edu802Dao.findByEdu801Id(edu801Id);
            List<Edu802PO> edu802POList = new ArrayList<>();

            for(Edu802 edu802 : edu802List){
                Edu802PO eee = new Edu802PO();
                try {
                    BeanUtils.copyProperties(eee, edu802);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                }
                if("check".equals(eee.getType())||"radio".equals(eee.getType())){
                    List<Edu803> edu803List = edu803Dao.findByEdu802Id(eee.getEdu802_ID().toString());
                    eee.setCkeckOrRaidoInfo(edu803List);
                }
                edu802POList.add(eee);
            }
            edu801PO.setAllQuestions(edu802POList);
            resultVO = ResultVO.setSuccess("查询成功",edu801PO);
        }
        return resultVO;
    }


    /**
     * 查询调查问卷详情
     * @return
     */
    public ResultVO searchQuestionDetail(String edu801Id) {
        ResultVO resultVO;
        Edu801 edu801 = edu801Dao.findOne(Long.parseLong(edu801Id));
        Edu801PO edu801PO = new Edu801PO();
        if(edu801 == null){
            resultVO = ResultVO.setFailed("该调查问卷已被删除，请刷新后重试");
        }else{
            try {
                BeanUtils.copyProperties(edu801PO, edu801);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
            List<Edu802> edu802List = edu802Dao.findByEdu801Id(edu801Id);
           List<Edu802PO> edu802POList = new ArrayList<>();

            for(Edu802 edu802 : edu802List){
                Edu802PO eee = new Edu802PO();
                try {
                    BeanUtils.copyProperties(eee, edu802);
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                }
                if("check".equals(eee.getType())||"radio".equals(eee.getType())){
                    List<Edu803> edu803List = edu803Dao.findByEdu802Id(eee.getEdu802_ID().toString());
                    eee.setCkeckOrRaidoInfo(edu803List);
                }
                edu802POList.add(eee);
           }
            edu801PO.setAllQuestions(edu802POList);
            resultVO = ResultVO.setSuccess("查询成功",edu801PO);
        }
        return resultVO;
    }

    /**
     * 删除调查问卷
     * @return
     */
    public ResultVO deleteQuestion(JSONArray deleteArray) {
        ResultVO resultVO;
        for (int i = 0; i < deleteArray.size(); i++) {
            String edu801Id = deleteArray.getString(i);
            edu803Dao.deleteByEdu801Id(edu801Id);
            edu802Dao.deleteByEdu801Id(edu801Id);
            edu801Dao.delete(Long.parseLong(edu801Id));

        }
        resultVO = ResultVO.setSuccess("删除成功");
        return resultVO;
    }

    /**
     * 新增调查问卷
     * @return
     */
    public ResultVO addQuestion(Edu801PO edu801) {
        ResultVO resultVO;
        Edu801 e = new Edu801();
        try {
            BeanUtils.copyProperties(e, edu801);
            e.setNum(0);
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
            e.setCreateDate(df.format(new Date()));
        } catch (IllegalAccessException ex) {
            ex.printStackTrace();
        } catch (InvocationTargetException ex) {
            ex.printStackTrace();
        }
        edu801Dao.save(e);
        List<Edu802PO> edu802POList = edu801.getAllQuestions();
        for(Edu802PO edu802PO : edu802POList){
            Edu802 ee = new Edu802();
            try {
                BeanUtils.copyProperties(ee, edu802PO);
                ee.setEdu801_ID(e.getEdu801_ID());
                edu802Dao.save(ee);
            } catch (IllegalAccessException ex) {
                ex.printStackTrace();
            } catch (InvocationTargetException ex) {
                ex.printStackTrace();
            }

            if("check".equals(ee.getType())||"radio".equals(ee.getType())){
                List<Edu803> edu803List = edu802PO.getCkeckOrRaidoInfo();
                for(int j = 0;j<edu803List.size();j++){
                    Edu803 edu803 = edu803List.get(j);
                    int options = Integer.parseInt(edu803.getCheckOrRadioIndex())+65;
                    char c = (char) options;
                    edu803.setCheckOrRadioIndex(String.valueOf(c));
                    edu803.setEdu802_ID(ee.getEdu802_ID());
                    edu803.setNum(0);
                    edu803Dao.save(edu803);
                }
            }
        }
        resultVO = ResultVO.setSuccess("添加成功");
        return resultVO;
    }
}
