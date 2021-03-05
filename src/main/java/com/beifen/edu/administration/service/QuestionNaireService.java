package com.beifen.edu.administration.service;


import com.beifen.edu.administration.PO.Edu801PO;
import com.beifen.edu.administration.PO.Edu802PO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu801Dao;
import com.beifen.edu.administration.dao.Edu802Dao;
import com.beifen.edu.administration.dao.Edu803Dao;
import com.beifen.edu.administration.domian.Edu801;
import com.beifen.edu.administration.domian.Edu802;
import com.beifen.edu.administration.domian.Edu803;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
