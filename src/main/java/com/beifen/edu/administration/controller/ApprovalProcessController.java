package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.domian.Edu600;
import com.beifen.edu.administration.service.ApprovalProcessService;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 审批流程控制层
 */
@Controller
public class ApprovalProcessController {

    @Autowired
    private ApprovalProcessService approvalProcessService;
    ReflectUtils utils = new ReflectUtils();


    @RequestMapping(value = "startApproval",method = RequestMethod.POST)
    @ResponseBody
    public Object startApproval(@RequestBody Edu600 edu600) {
        boolean result = true;

        Map<String, Object> returnMap = new HashMap();
        edu600.setExaminerRole(edu600.getProposerType());
        edu600.setExaminerkey(edu600.getProposerKey());
        edu600.setApprovalState("0");
        edu600.setCreatDate(new Date());
        edu600.setUpdateDate(new Date());

        approvalProcessService.initiationProcess(edu600);

        returnMap.put("result", result);
        return returnMap;
    }


}
