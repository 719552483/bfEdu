package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.BigDataSearchPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu800;
import com.beifen.edu.administration.service.BigDataService;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 大数据控制层
 */
@RestController
public class BigDataContoller {
    @Autowired
    private BigDataService bigDataService;

    ReflectUtils utils = new ReflectUtils();

    /**
     *财务信息存储
     * @param financeInfo
     * @return
     */
    @RequestMapping("/saveFinanceInfo")
    @ResponseBody
    public ResultVO saveFinanceInfo(@RequestParam("financeInfo") String financeInfo) {
        Edu800 edu800 = JSON.parseObject(financeInfo, Edu800.class);
        ResultVO result = bigDataService.saveFinanceInfo(edu800);
        return result;
    }

    /**
     *财务信息存储
     * @param deleteIds
     * @return
     */
    @RequestMapping("/deleteFinanceInfo")
    @ResponseBody
    public ResultVO deleteFinanceInfo(@RequestParam("deleteIds") String deleteIds) {
        List<String> edu108IdList = JSON.parseArray(deleteIds, String.class);
        ResultVO result = bigDataService.deleteFinanceInfo(edu108IdList);
        return result;
    }

    /**
     *财务信息查询
     * @return
     */
    @RequestMapping("/getDataPredtiction")
    @ResponseBody
    public ResultVO getDataPredtiction(@RequestParam("year") String year,@RequestParam("departmentCode") String departmentCode) {
        ResultVO result = bigDataService.getDataPredtiction(year,departmentCode);
        return result;
    }

    /**
     *获取大屏展示数据
     * @return
     */
    @RequestMapping("/getBigScreenData")
    @ResponseBody
    public ResultVO getBigScreenData(@RequestParam("searchInfo") String searchInfo) {
        BigDataSearchPO bigDataSearch = JSON.parseObject(searchInfo, BigDataSearchPO.class);
        ResultVO result = bigDataService.getBigScreenData(bigDataSearch);
        return result;
    }
}
