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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        edu801Dao.save(edu801);
        List<Edu802PO> edu802POList = edu801.getEdu802List();
        for(int i = 0;i<edu802POList.size();i++){
            Edu802PO edu802PO = edu802POList.get(i);
            edu802PO.setEdu801_ID(edu801.getEdu801_ID());
            edu802Dao.save(edu802PO);
            if("checked".equals(edu802PO.getType())||"radio".equals(edu802PO.getType())){
                List<Edu803> edu803List = edu802PO.getEdu803List();
                for(int j = 0;j<edu802POList.size();j++){
                    Edu803 edu803 = edu803List.get(j);
                    int options = Integer.parseInt(edu803.getIndex())+65;
                    char c = (char) options;
                    edu803.setIndex(String.valueOf(c));
                    edu803.setEdu803_ID(edu802PO.getEdu802_ID());
                    edu803Dao.save(edu803);
                }
            }
        }
        resultVO = ResultVO.setSuccess("添加成功");
        return resultVO;
    }
}
