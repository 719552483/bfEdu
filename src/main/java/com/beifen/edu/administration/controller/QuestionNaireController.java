package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.service.QuestionNaireService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
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
}
