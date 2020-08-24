package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu990;
import com.beifen.edu.administration.domian.Edu991;
import com.beifen.edu.administration.service.SystemManageService;
import com.beifen.edu.administration.utility.ReflectUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

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
    public ResultVO newUser(@RequestParam("newUserInfo") String newUserInfo,@RequestParam String departments) {
        JSONObject jsonObject = JSONObject.fromObject(newUserInfo);
        Edu990 edu990 = (Edu990) JSONObject.toBean(jsonObject, Edu990.class);
        List<String> departmentList = JSON.parseArray(departments, String.class);
        ResultVO result = systemManageService.newUser(edu990,departmentList);
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



}
