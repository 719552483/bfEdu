package com.beifen.edu.administration.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.beifen.edu.administration.PO.LocalUsedPO;
import com.beifen.edu.administration.PO.SchoolTimetablePO2;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.domian.Edu0051;
import com.beifen.edu.administration.domian.Edu500;
import com.beifen.edu.administration.domian.Edu501;
import com.beifen.edu.administration.domian.Edu502;
import com.beifen.edu.administration.service.TeachingPointService;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.List;

//教学任务点控制层
@Controller
public class TeachingPointController {

    @Autowired
    private TeachingPointService teachingPointService;

    ReflectUtils utils = new ReflectUtils();
    /**
     * 新增教学点
     * @param newSiteInfo
     * @return returnMap
     */
    @RequestMapping("/addSiteInfo")
    @ResponseBody
    public ResultVO addSiteInfo(@RequestParam("newSiteInfo") String newSiteInfo) {
        JSONObject jsonObject = JSONObject.parseObject(newSiteInfo);
        Edu500 edu500 = JSON.toJavaObject(jsonObject,Edu500.class);
        ResultVO result = teachingPointService.addSite(edu500);
        return result;
    }

    /**
     * 搜索教学点
     * @param SearchCriteria
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("/searchSite")
    @ResponseBody
    public Object searchSite(@RequestParam String SearchCriteria) {
        JSONObject jsonObject = JSONObject.parseObject(SearchCriteria);
        Edu500 edu500 = JSON.toJavaObject(jsonObject,Edu500.class);
        ResultVO result = teachingPointService.searchSite(edu500);
        return result;
    }

    /**
     * 搜索全部教学点
     * @return
     */
    @RequestMapping("/searchAllLocal")
    @ResponseBody
    public ResultVO searchAllLocal() {
        ResultVO result = teachingPointService.searchAllLocal();
        return result;
    }

    /**
     * 删除教学点
     * @param removeIDs
     * @return
     */
    @RequestMapping("/removeSite")
    @ResponseBody
    public ResultVO removeSite(@RequestParam String removeIDs) {
        List<String> deleteArray = JSONObject.parseArray(removeIDs,String.class);
        ResultVO result = teachingPointService.removeSite(deleteArray);
        return result;
    }

    /**
     * 搜索教学使用情况
     * @param SearchCriteria
     * @return returnMap
     */
    @RequestMapping("/searchLocalUsed")
    @ResponseBody
    public ResultVO searchLocalUsed(@RequestParam String SearchCriteria) {
        LocalUsedPO localUsedPO = JSON.parseObject(SearchCriteria,LocalUsedPO.class);
        ResultVO result = teachingPointService.searchLocalUsed(localUsedPO);
        return result;
    }


    /**
     * 新增教学任务点
     * @param newSiteInfo
     * @return returnMap
     */
    @RequestMapping("/addLocalPointInfo")
    @ResponseBody
    public ResultVO addLocalPointInfo(@RequestParam("newSiteInfo") String newSiteInfo) {
        JSONObject jsonObject = JSONObject.parseObject(newSiteInfo);
        Edu501 edu501 = JSON.toJavaObject(jsonObject,Edu501.class);
        ResultVO result = teachingPointService.addLocalPointInfo(edu501);
        return result;
    }

    /**
     * 搜索教学点
     * @param SearchCriteria
     *            搜索条件
     * @return returnMap
     */
    @RequestMapping("/searchPointInfo")
    @ResponseBody
    public ResultVO searchPointInfo(@RequestParam("SearchCriteria") String SearchCriteria) {
        JSONObject jsonObject = JSONObject.parseObject(SearchCriteria);
        Edu501 edu501 = JSON.toJavaObject(jsonObject,Edu501.class);
        ResultVO result = teachingPointService.searchPointInfo(edu501);
        return result;
    }


    /**
     * 删除教学任务点
     * @param removeIDs
     * @return
     */
    @RequestMapping("/removePoint")
    @ResponseBody
    public ResultVO removePoint(@RequestParam String removeIDs) {
        List<String> deleteArray = JSONObject.parseArray(removeIDs,String.class);
        ResultVO result = teachingPointService.removePoint(deleteArray);
        return result;
    }

    /**
     * 根据教学点查询教学任务点
     * @param edu500Id
     * @return
     */
    @RequestMapping("/getPointBySite")
    @ResponseBody
    public ResultVO getPointBySite(@RequestParam("SearchObject") String edu500Id) {
        ResultVO result = teachingPointService.getPointBySite(edu500Id);
        return result;
    }

    /**
     * 根据教学点查询固定资产
     * @param edu500Id
     * @return
     */
    @RequestMapping("/getLocalAssets")
    @ResponseBody
    public ResultVO getLocalAssets(@RequestParam("edu500Id") String edu500Id) {
        ResultVO result = teachingPointService.getLocalAssets(edu500Id);
        return result;
    }

    /**
     * 根据教学任务点查询固定资产
     * @param edu501Id
     * @return
     */
    @RequestMapping("/getLocalPoingAssets")
    @ResponseBody
    public ResultVO getLocalPoingAssets(@RequestParam("edu501Id") String edu501Id) {
        ResultVO result = teachingPointService.getLocalPoingAssets(edu501Id);
        return result;
    }

    /**
     * 保存教学任务点物资信息
     * @param assetsDetails
     * @return
     */
    @RequestMapping("/saveAssets")
    @ResponseBody
    public ResultVO saveAssets(@RequestParam("assetsDetails") String assetsDetails) {
        List<Edu502> edu502List = JSON.parseArray(assetsDetails, Edu502.class);
        ResultVO result = teachingPointService.saveAssets(edu502List);
        return result;
    }


    /**
     * 根据学年id和教学任务点id查询排课详情
     * @return
     */
    @RequestMapping("/searchCourseDetailByXNAndPointid")
    @ResponseBody
    public ResultVO searchCourseDetailByXNAndPointid(@RequestParam("term") String term,@RequestParam("pointId")String pointId) {
        ResultVO result =teachingPointService.searchCourseDetailByXNAndPointid(term,pointId);
        return result;
    }

    /**
     * 导出教学任务点-校验
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportPointByCityCheck")
    @ResponseBody
    public ResultVO exportPointByCityCheck(HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "sendObject") String sendObject) {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(sendObject);
        String city = jsonObject.getString("city");
        String item = jsonObject.getString("item");

        List<Edu500> list = teachingPointService.queryPointByCity(city);
        if(list.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的数据，请重新输入");
        }else{
            result = ResultVO.setSuccess("成功");
        }
        return result;
    }

    /**
     * 导出教学任务点
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportPointByCity")
    @ResponseBody
    public ResultVO exportPointByCity(HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "sendObject") String sendObject) {
        ResultVO result;
        net.sf.json.JSONObject jsonObject = net.sf.json.JSONObject.fromObject(sendObject);
        String city = jsonObject.getString("city");
        String item = jsonObject.getString("item");

        List<Edu500> list = teachingPointService.queryPointByCity(city);
        /*if(list.size() == 0) {
            result = ResultVO.setFailed("当前条件未找到可以导出的数据，请重新输入");
        }else{*/
            boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
            String fileName;
            if(isIE){
                fileName="PointDetail";
            }else{
                if(city != null && !"".equals(city)){
                    fileName=list.get(0).getCity()+"教学点详情合并导出";
                }else{
                    fileName="教学点详情合并导出";
                }

            }
            //创建Excel文件
            List<String> titleList = Arrays.asList(item.split(","));
            XSSFWorkbook workbook = teachingPointService.exportPointByCity(list,titleList);
            try {
                utils.loadModal(response,fileName, workbook);
            } catch (IOException e) {
                e.printStackTrace();
            } catch (ParseException e) {
                e.printStackTrace();
            }
            result = ResultVO.setSuccess("下载成功");
//        }
        return result;
    }

    /**
     * 导出分散学时课表
     *
     * @return returnMap
     * @throws ParseException
     * @throws Exception
     */
    @RequestMapping("exportScattered")
    @ResponseBody
    public ResultVO exportScattered(HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "xnid") String xnid) {
        ResultVO result;
        List<SchoolTimetablePO2> list = teachingPointService.exportScattered(xnid);
        boolean isIE=utils.isIE(request.getHeader("User-Agent").toLowerCase());
        String fileName;
        if(isIE){
            fileName="PointDetail";
        }else if(list.size() != 0){
            fileName=list.get(0).getXn()+"分散学时导出";
        }else{
            fileName="分散学时导出";
        }
        //创建Excel文件
        XSSFWorkbook workbook = teachingPointService.exportScatteredExcle(list);
        try {
            utils.loadModal(response,fileName, workbook);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        result = ResultVO.setSuccess("下载成功");
        return result;
    }

}
