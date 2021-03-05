package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.Edu801PO;
import com.beifen.edu.administration.PO.Edu802PO;
import com.beifen.edu.administration.PO.TestTaskSearchPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu801;
import com.beifen.edu.administration.domian.Edu802;
import com.beifen.edu.administration.domian.Edu803;
import com.beifen.edu.administration.service.QuestionNaireService;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


//调查问卷控制层
@Controller
public class QuestionNaireController {

    @Autowired
    private QuestionNaireService questionNaireService;

    /**
     * 查询所有调查问卷
     * @param
     * @return
     */
    @RequestMapping("/searchAllQuestion")
    @ResponseBody
    public ResultVO searchAllQuestion() {
        ResultVO result = questionNaireService.searchAllQuestion();
        return result;
    }

    /**
     * 查询调查问卷详情
     * @param
     * @return
     */
    @RequestMapping("/searchQuestionDetail")
    @ResponseBody
    public ResultVO searchQuestionDetail(@RequestParam("edu801Id") String edu801Id) {
        ResultVO result = questionNaireService.searchQuestionDetail(edu801Id);
        return result;
    }

    /**
     * 新增调查问卷
     * @param
     * @return
     */
    @RequestMapping("/addQuestion")
    @ResponseBody
    public ResultVO addQuestion(@RequestParam("questionInfo") String questionInfo) {
        JSONObject jsonObject = JSONObject.fromObject(questionInfo);
        Map<String, Class> classMap = new HashMap<>();
        classMap.put("allQuestions", Edu802PO.class);
        classMap.put("ckeckOrRaidoInfo", Edu803.class);
//        Edu801PO  dto = (Edu801PO) JSONObject.toBean(jsonObject, Edu801PO.class, classMap);
        Edu801PO jsonRootBean = (Edu801PO) net.sf.json.JSONObject.toBean(jsonObject,Edu801PO.class,classMap);
        ResultVO result = questionNaireService.addQuestion(jsonRootBean);
        return result;
    }
}