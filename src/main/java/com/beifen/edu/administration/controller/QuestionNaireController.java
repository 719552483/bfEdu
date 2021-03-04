package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.PO.Edu801PO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu101;
import com.beifen.edu.administration.domian.Edu801;
import com.beifen.edu.administration.service.QuestionNaireService;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


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
     * 新增调查问卷
     * @param
     * @return
     */
    @RequestMapping("/addQuestion")
    @ResponseBody
    public ResultVO addQuestion(@RequestParam("questionInfo") String questionInfo) {
        JSONObject jsonObject = JSONObject.fromObject(questionInfo);
        Edu801PO edu801PO = (Edu801PO) JSONObject.toBean(jsonObject, Edu801PO.class);
        ResultVO result = questionNaireService.addQuestion(edu801PO);
        return result;
    }
}
