package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu500;
import com.beifen.edu.administration.domian.Edu501;
import com.beifen.edu.administration.domian.Edu502;
import com.beifen.edu.administration.service.QuestionNaireService;
import com.beifen.edu.administration.service.TeachingPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

//教学任务点控制层
@Controller
public class QuestionNaireController {

    @Autowired
    private QuestionNaireService questionNaireService;

    /**
     * 保存教学任务点物资信息
     * @param
     * @return
     */
    @RequestMapping("/searchAllQuestion")
    @ResponseBody
    public ResultVO searchAllQuestion() {
        ResultVO result = questionNaireService.searchAllQuestion();
        return result;
    }
}
