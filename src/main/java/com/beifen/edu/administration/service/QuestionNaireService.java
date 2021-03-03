package com.beifen.edu.administration.service;


import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu801Dao;
import com.beifen.edu.administration.domian.Edu801;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


//调查问卷业务层
@Service
public class QuestionNaireService {

    @Autowired
    Edu801Dao edu801Dao;


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
}
