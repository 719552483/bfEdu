package com.beifen.edu.administration.service;


import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.Edu800Dao;
import com.beifen.edu.administration.domian.Edu800;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 大数据业务层
 */
@Configuration
@Service
public class BigDataService {

    @Autowired
    private Edu800Dao edu800Dao;

    //保存大数据财务信息
    public ResultVO saveFinanceInfo(Edu800 edu800) {
        ResultVO resultVO;
        String createDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
        edu800.setCreateDate(createDate);
        edu800Dao.save(edu800);
        resultVO = ResultVO.setSuccess("操作成功",edu800);
        return resultVO;
    }


    //删除大数据财务信息
    public ResultVO deleteFinanceInfo(List<String> edu108IdList) {
        ResultVO resultVO;
        edu800Dao.deleteByEdu108Ids(edu108IdList);
        resultVO = ResultVO.setSuccess("删除了"+edu108IdList.size()+"条信息");
        return resultVO;
    }


    //获取大数据财务信息
    public ResultVO getDataPredtiction() {
        ResultVO resultVO;
        Map<String,Object> returnMap = new HashMap<>();

        List<Edu800> edu800List = edu800Dao.findAll();
        List<Edu800> edu108SumList = edu800Dao.findSumInfo();

        returnMap.put("edu800List",edu800List);
        returnMap.put("edu108SumList",edu108SumList);

        resultVO = ResultVO.setSuccess("查询成功",returnMap);

        return resultVO;
    }
}
