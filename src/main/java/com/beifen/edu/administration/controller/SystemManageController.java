package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.PageRequestPO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.service.SystemManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

//系统管理控制层
@Controller
public class SystemManageController {

    ReflectUtils utils = new ReflectUtils();
    @Autowired
    private SystemManageService systemManageService;

    /**
     * 检查有没有系统用户
     * @return
     */
    @RequestMapping("/checkHaveSysUser")
    @ResponseBody
    public ResultVO checkHaveSysUser() {
        ResultVO result = systemManageService.checkHaveSysUser();
        return result;
    }

    /**
     * 注册系统用户
     * @param username
     * @param password
     * @return
     */
    @RequestMapping("/registerUser")
    @ResponseBody
    public ResultVO registerUser(@RequestParam String username, @RequestParam String password) {
        ResultVO result;
        result = systemManageService.newManagerUser(username,password);
        return result;
    }

    /**
     * 查询二级代码信息
     * @return
     */
    @RequestMapping("/getEJDM")
    @ResponseBody
    public ResultVO getEJDM() {
        ResultVO result = systemManageService.queryEjdm();
        return result;
    }

    /**
     * 用户登录查询
     * @param username
     * @param password
     * @return
     */
    @RequestMapping("/verifyUser")
    @ResponseBody
    public ResultVO verifyUser(@RequestParam String username, @RequestParam String password) {
        ResultVO result;
        result = systemManageService.verifyUser(username,password);
        return result;
    }

    /**
     * 修改首页快捷方式
     * @param userId
     * @param newShortcut
     * @return
     */
    @RequestMapping("/newShortcut")
    @ResponseBody
    public ResultVO newShortcut(@RequestParam String userId, @RequestParam String newShortcut) {
        ResultVO result = systemManageService.newShortcut(userId, newShortcut);
        return result;
    }

    /**
     * 新增修改角色
     * @param newRoleInfo
     * @return
     */
    @RequestMapping("/addRole")
    @ResponseBody
    public ResultVO addRole(@RequestParam String newRoleInfo) {
        JSONObject jsonObject = JSONObject.fromObject(newRoleInfo);
        Edu991 edu991 = (Edu991) JSONObject.toBean(jsonObject, Edu991.class);
        ResultVO result = systemManageService.addRole(edu991);
        return result;
    }

    /**
     * 删除角色
     * @param deleteIds
     * @return
     */
    @RequestMapping("/removeRole")
    @ResponseBody
    public ResultVO removeRole(@RequestParam String deleteIds) {
        List<String> roleIdList = JSON.parseArray(deleteIds, String.class);
        ResultVO result = systemManageService.removeRole(roleIdList);
        return result;
    }

    /**
     * 获取所有角色（不包括系统用户角色）
     * @return
     */
    @RequestMapping("/getAllRole")
    @ResponseBody
    public ResultVO getAllRole() {
        ResultVO result = systemManageService.getAllRole();
        return result;
    }

    /**
     * 获取所有用户（不包括系统用户）
     * @return
     */
    @RequestMapping("/getAllUser")
    @ResponseBody
    public ResultVO getAllUser() {
        ResultVO result = systemManageService.queryAllUser();
        return result;
    }

    /**
     * 根据用户id查询用户信息
     * @param userId
     * @return
     */
    @RequestMapping("/queryUserById")
    @ResponseBody
    public ResultVO queryUserById(@RequestParam("userId") String userId) {
        ResultVO result = systemManageService.queryUserById(userId);
        return result;
    }

    /**
     *  新增用户
     * @param newUserInfo
     * @return
     */
    @RequestMapping("/newUser")
    @ResponseBody
    public ResultVO newUser(@RequestParam("newUserInfo") String newUserInfo) {
        JSONObject jsonObject = JSONObject.fromObject(newUserInfo);
        Edu990 edu990 = (Edu990) JSONObject.toBean(jsonObject, Edu990.class);
        ResultVO result = systemManageService.newUser(edu990);
        return result;
    }

    /**
     *  删除用户
     * @param deleteIds
     * @return
     */
    @RequestMapping("/removeUser")
    @ResponseBody
    public ResultVO removeUser(@RequestParam("deleteIds") String deleteIds) {
        List<String> deleteIdList = JSON.parseArray(deleteIds, String.class);
        ResultVO result = systemManageService.removeUser(deleteIdList);
        return result;
    }

    /**
     * 分页查询用户信息
     * @param pageRequest
     * @return
     */
    @RequestMapping("/queryUserList")
    @ResponseBody
    public ResultVO queryUserList(@RequestBody PageRequestPO pageRequest) {
        ResultVO result = systemManageService.queryUserList(pageRequest);
        return result;
    }

    /**
     * 发布通知
     * @param noticDetail
     * @return
     */
    @RequestMapping("/issueNotice")
    @ResponseBody
    public ResultVO sendNotice(@RequestParam("noticDetail") String noticDetail) {
        com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(noticDetail);
        Edu700 edu700 = JSON.toJavaObject(jsonObject, Edu700.class);
        ResultVO result = systemManageService.sendNotice(edu700);
        return result;
    }

    /**
     * 根据id获取通知
     * @return returnMap
     */
    @RequestMapping("getNoteInfoById")
    @ResponseBody
    public ResultVO getNoteInfoById(@RequestParam("noteId") String noteId) {
        ResultVO resultVO = systemManageService.getNoteInfoById(noteId);
        return resultVO;
    }

    /**
     * 根据id集合删除通知
     * @param removeInfo
     * @return
     */
    @RequestMapping("removeNotices")
    @ResponseBody
    public ResultVO removeNotices(@RequestParam("removeInfo") String removeInfo) {
        List<String> removeIds = JSON.parseArray(removeInfo, String.class);
        ResultVO resultVO = systemManageService.removeNotices(removeIds);
        return resultVO;
    }

    /**
     * 获取所有通知
     * @return returnMap
     */
    @RequestMapping("getMoreNotice")
    @ResponseBody
    public ResultVO getMoreNotice(@RequestParam("userId") String userId) {
        ResultVO resultVO = systemManageService.getMoreNotice(userId);
        return resultVO;
    }

    /**
     * 获取首页通知
     * @return returnMap
     */
    @RequestMapping("getNotices")
    @ResponseBody
    public ResultVO getNotices(@RequestParam("userId") String userId) {
        ResultVO resultVO = systemManageService.getNotices(userId);
        return resultVO;
    }

    /**
     * 改变消息是否在首页展示
     * @return returnMap
     */
    @RequestMapping("changeNoticeIsShowIndex")
    @ResponseBody
    public Object changeNoticeIsShowIndex(@RequestParam("noticeId") String noticeId, @RequestParam("isShow") String isShow) {
        Map<String, Object> returnMap = new HashMap();
        systemManageService.changeNoticeIsShowIndex(noticeId,isShow);
        returnMap.put("result", true);
        return returnMap;
    }

    /**
     * 获取用户发布的通知
     * @return returnMap
     */
    @RequestMapping("getNoticeByUser")
    @ResponseBody
    public ResultVO getNoticeByUser(@RequestParam("userId") String userId) {
        ResultVO resultVO = systemManageService.getNoticeByUser(userId);
        return resultVO;
    }
    /**
     * 新增二级代码
     * @param newCodeInfo
     * @return returnMap
     */
    @RequestMapping("/addSecondaryCode")
    @ResponseBody
    public ResultVO addSecondaryCode(@RequestParam("newCodeInfo") String newCodeInfo) {
        Edu000 edu000 = JSON.parseObject(newCodeInfo, Edu000.class);
        ResultVO result = systemManageService.addSecondaryCode(edu000);
        return result;
    }

    /**
     * 搜索二级代码
     * @param searchCriteria
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("/searchSecondaryCode")
    @ResponseBody
    public ResultVO searchSecondaryCode(@RequestParam String searchCriteria) {
        Edu000 edu000 = JSON.parseObject(searchCriteria, Edu000.class);
        ResultVO result = systemManageService.searchSecondaryCode(edu000);
        return result;
    }

    /**
     * 删除二级代码
     * @param removeIDs
     * @return
     */
    @RequestMapping("/removeSecondaryCode")
    @ResponseBody
    public ResultVO removeSecondaryCode(@RequestParam String removeIDs) {
        List<String> deleteArray = com.alibaba.fastjson.JSONObject.parseArray(removeIDs,String.class);
        ResultVO result = systemManageService.removeSecondaryCode(deleteArray);
        return result;
    }

    /**
     * 获取首页图表数据
     * @return
     */
    @RequestMapping("/getIndexChart")
    @ResponseBody
    public ResultVO getIndexChart() {
        ResultVO result = systemManageService.getIndexChart();
        return result;
    }
}
