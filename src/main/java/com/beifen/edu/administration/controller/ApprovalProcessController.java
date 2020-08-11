package com.beifen.edu.administration.controller;

import com.beifen.edu.administration.PO.Edu600BO;
import com.beifen.edu.administration.domian.Edu600;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.service.ApprovalProcessService;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 审批流程控制层
 */
@Controller
public class ApprovalProcessController {

    @Autowired
    private ApprovalProcessService approvalProcessService;
    ReflectUtils utils = new ReflectUtils();


    /**
     * 流程发起入口
     * @param edu600
     * @return
     */
    @RequestMapping(value = "startApproval",method = RequestMethod.GET)
    @ResponseBody
    public Object startApproval(@RequestBody Edu600 edu600) {
        boolean result;
//        JSONObject jsonObject = JSONObject.fromObject(approvalText);
//        Edu600 edu600 = (Edu600BO) JSONObject.toBean(jsonObject, Edu600.class);

        Map<String, Object> returnMap = new HashMap();

        result = approvalProcessService.initiationProcess(edu600);

        returnMap.put("result", result);
        return returnMap;
    }


    /**
     * 搜索审批信息
     * @param approvalText
     * @return
     */
    @RequestMapping(value = "searchApproval",method = RequestMethod.GET)
    @ResponseBody
    public Object searchApproval(@RequestParam("approvalText") String approvalText) {
        Map<String, Object> returnMap = new HashMap();
        JSONObject jsonObject = JSONObject.fromObject(approvalText);
        Edu600BO edu600BO = (Edu600BO) JSONObject.toBean(jsonObject, Edu600BO.class);
        List<Edu600BO> approvalList = approvalProcessService.searchApproval(edu600BO);
        returnMap.put("approvalList", approvalList);
        returnMap.put("result", true);
        return returnMap;
    }

    /**
     *获取申请人列表
     * @return
     */
    @RequestMapping(value = "getProposerList",method = RequestMethod.GET)
    @ResponseBody
    public Object getProposerList() {
        Map<String, Object> returnMap = new HashMap();
        List<Edu990> proposerList = approvalProcessService.getProposerList();
        returnMap.put("proposerList", proposerList);
        returnMap.put("result", true);
        return returnMap;
    }

    /**
     * 搜索可追回审批信息
     * @param approvalText
     * @return
     */
    @RequestMapping(value = "searchCanBackApproval",method = RequestMethod.GET)
    @ResponseBody
    public Object searchCanBackApproval(@RequestParam("approvalText") String approvalText) {
        Map<String, Object> returnMap = new HashMap();
        JSONObject jsonObject = JSONObject.fromObject(approvalText);
        Edu600BO edu600BO = (Edu600BO) JSONObject.toBean(jsonObject, Edu600BO.class);
        List<Edu600BO> approvalList = approvalProcessService.searchCanBackApproval(edu600BO);
        returnMap.put("approvalList", approvalList);
        returnMap.put("result", true);
        return returnMap;
    }

    /**
     *审批操作
     * @param approvalText
     * @return
     *
     */
    @RequestMapping(value = "approvalOperation",method = RequestMethod.GET)
    @ResponseBody
    public Object approvalOperation(@RequestParam("approvalText") String approvalText) {
        Map<String, Object> returnMap = new HashMap();
        JSONObject jsonObject = JSONObject.fromObject(approvalText);
        Edu600BO edu600BO = (Edu600BO) JSONObject.toBean(jsonObject, Edu600BO.class);
        boolean result = approvalProcessService.approvalOperation(edu600BO);
        returnMap.put("result", result);
        return returnMap;
    }

    /**
     *获取审批业务详情
     * @param approvalText
     * @return
     */
    @RequestMapping(value = "getApprovalDeatils",method = RequestMethod.GET)
    @ResponseBody
    public Object getApprovalDeatils(@RequestParam("approvalText") String approvalText) {
        boolean result = true;
        Map<String, Object> returnMap = new HashMap();
        JSONObject jsonObject = JSONObject.fromObject(approvalText);
        Edu600BO edu600BO = (Edu600BO) JSONObject.toBean(jsonObject, Edu600BO.class);
        Object businessInfo = approvalProcessService.getApprovalDeatils(edu600BO);
        returnMap.put("businessInfo", businessInfo);
        returnMap.put("result", result);
        return returnMap;
    }


}
