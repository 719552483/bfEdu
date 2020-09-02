package com.beifen.edu.administration.service;

import com.alibaba.fastjson.JSON;
import com.beifen.edu.administration.PO.Edu990PO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.lang.reflect.InvocationTargetException;
import java.text.SimpleDateFormat;
import java.util.*;

//系统管理业务层
@Service
public class SystemManageService {
    ReflectUtils utils = new ReflectUtils();
    @Autowired
    Edu990Dao edu990Dao;
    @Autowired
    Edu991Dao edu991Dao;
    @Autowired
    Edu992Dao edu992Dao;
    @Autowired
    Edu000Dao edu000Dao;
    @Autowired
    Edu104Dao edu104Dao;
    @Autowired
    Edu101Dao edu101Dao;
    @Autowired
    Edu001Dao edu001Dao;
    @Autowired
    RedisUtils redisUtils;
    @Autowired
    Edu994Dao edu994Dao;


    // 检查有没有系统用户
    public ResultVO checkHaveSysUser() {
        ResultVO resultVO = new ResultVO();
        Edu990 edu990 = edu990Dao.checkHaveSysUser("sys");
        if (edu990 == null) {
            resultVO = ResultVO.setFailed("未检测到系统用户，为您跳转到注册页面");
        } else {
            resultVO.setCode(200);
        }
        return resultVO;
    }

    public ResultVO newManagerUser(String username, String password) {
        ResultVO resultVO;
        Map<String, Object> returnMap = new HashMap();
        String sysRole = "sys";
        // 生成系统用户
        Edu990 edu990 = new Edu990();
        edu990.setJs(sysRole);
        edu990.setYhm(username);
        edu990.setMm(password);
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
        edu990.setScdlsj(df.format(new Date()));
        Edu990 save = edu990Dao.save(edu990);
        if(save == null) {
            resultVO = ResultVO.setFailed("新增管理员失败");
            return resultVO;
        }

        // 生成系统用户权限
        Edu991 edu991 = new Edu991();
        edu991.setJs(sysRole);
        edu991.setAnqx(sysRole);
        edu991.setCdqx(sysRole);
        Edu991 Edu991save = edu991Dao.save(edu991);
        if(Edu991save == null) {
            resultVO = ResultVO.setFailed("新增管理员失败");
            return resultVO;
        }

        Edu992 edu992 = new Edu992();
        edu992.setBF990_ID(edu990.getBF990_ID());
        edu992.setBF991_ID(edu991.getBF991_ID());
        edu992Dao.save(edu992);



        // 获取系统用户保存在页面session信息
        Edu990 UserInfo = edu990Dao.getUserInfo(username);
        UserInfo.setScdlsj("fristTime");
        Edu991 authoritysInfo = edu991Dao.getAuthoritysInfo(edu990.getJs());

        returnMap.put("UserInfo", JSON.toJSONString(UserInfo));
        returnMap.put("authoritysInfo", JSON.toJSONString(authoritysInfo));

        resultVO = ResultVO.setSuccess("新增管理员成功",returnMap);
        return resultVO;
    }

    // 获取二级代码
    public ResultVO queryEjdm() {
        ResultVO resultVO;
        Map<String, Object> returnMap = new HashMap();
        List<Edu000> queruRs = edu000Dao.queryejdm();
        if(queruRs.size() == 0) {
            resultVO = ResultVO.setFailed("未找到任何二级代码信息，请及时联系管理员处理");
        } else {
            // 初始化一个map
            Map<String, List<Edu000>> map = new HashMap<>();
            for (Edu000 edu000 : queruRs) {
                String key = edu000.getEjdmglzd();
                if (map.containsKey(key)) {
                    // map中存在以此id作为的key，将数据存放当前key的map中
                    map.get(key).add(edu000);
                } else {
                    // map中不存在以此id作为的key，新建key用来存放数据
                    List<Edu000> userList = new ArrayList<>();
                    userList.add(edu000);
                    map.put(key, userList);
                }
            }
            returnMap.put("allEJDM", map);
            resultVO = ResultVO.setSuccess("二级代码查询成功",returnMap);
        }
        return resultVO;
    }

    //验证用户登陆
    public ResultVO verifyUser(String username, String password) {
        ResultVO resultVO = new ResultVO();
        Map<String, Object> returnMap = new HashMap();

        Edu990 checkIsHaveUser = edu990Dao.checkIsHaveUser(username);
        String datebasePwd = edu990Dao.checkPwd(username);
        // 用户不存在
        if (checkIsHaveUser == null || !password.equals(datebasePwd)) {
            resultVO = ResultVO.setFailed("用户名或密码错误，请重新输入");
            return resultVO;
        }
        //用户登陆成功
        if (checkIsHaveUser != null && password.equals(datebasePwd)) {
            Edu990 edu990 = edu990Dao.getUserInfo(username);
            List<Edu991> authoritys = edu991Dao.findRollByEdu990(edu990.getBF990_ID().toString());
            if (edu990 != null && authoritys.size() != 0) {
                // 用户首次登陆
                if (edu990.getScdlsj() == null) {
                    edu990.setScdlsj("fristTime");
                }
            }else {
                resultVO = ResultVO.setFailed("用户权限错误，请联系管理员");
                return resultVO;
            }



            //将学院权限存入redis备用
            List<String> deparmentIds = new ArrayList<>();
            String userId = edu990.getBF990_ID().toString();
            if(edu990.getUserKey() != null) {
                deparmentIds = edu994Dao.findAllDepartmentIds(userId);
                if (deparmentIds.size() == 0) {
                    if(username.length() >= 11) {
                        Edu001 edu001 = edu001Dao.findOne(Long.parseLong(edu990.getUserKey()));
                        deparmentIds.add(edu001.getSzxb());
                    } else {
                        Edu101 one = edu101Dao.findOne(Long.parseLong(edu990.getUserKey()));
                        deparmentIds.add(one.getSzxb());
                    }
                }
            } else {
                deparmentIds.add("0");
            }
            redisUtils.set("department:"+userId ,deparmentIds);


            //保存用户信息
            String userName = "";
            if(edu990.getUserKey() != null) {
                Edu101 edu101 = edu101Dao.findOne(Long.parseLong(edu990.getUserKey()));
                if (edu101 == null) {
                    Edu001 edu001 = edu001Dao.findOne(Long.parseLong(edu990.getUserKey()));
                    userName = edu001.getXm();
                } else {
                    userName = edu101.getXm();
                }
            }
            redisUtils.set("userName:"+userId ,userName);

            returnMap.put("UserInfo", JSON.toJSONString(edu990));
            returnMap.put("authoritysInfo", JSON.toJSONString(authoritys));
            // 更新用户上次登陆时间
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 设置日期格式
            edu990.setScdlsj(df.format(new Date()));
            edu990Dao.save(edu990);
        }
        resultVO = ResultVO.setSuccess("登陆成功",returnMap);
        return resultVO;
    }

    // 修改首页快捷方式
    public ResultVO newShortcut(String userId, String newShortcut) {
        ResultVO resultVO;
        edu990Dao.newShortcut(userId, newShortcut);
        resultVO = ResultVO.setSuccess("修改快捷方式成功");
        return resultVO;
    }

    //检查用户名是否存在
    public  List<Edu991> checkRoleName(Edu991 edu991){
        Specification<Edu991> specification = new Specification<Edu991>() {
            public Predicate toPredicate(Root<Edu991> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu991.getBF991_ID() != null && !"".equals(edu991.getBF991_ID())) {
                    predicates.add(cb.notEqual(root.<String> get("BF991_ID"), edu991.getBF991_ID()));
                }
                if (edu991.getJs() != null && !"".equals(edu991.getJs())) {
                    predicates.add(cb.equal(root.<String> get("js"), edu991.getJs()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu991> edu991List = edu991Dao.findAll(specification);
        return edu991List;
    }

    // 新增角色
    public ResultVO addRole(Edu991 edu991) {
        ResultVO resultVO;
        // 判断角色名称是否存在
        List<Edu991> edu991List = checkRoleName(edu991);
        if (edu991List.size() != 0) {
            resultVO = ResultVO.setFailed("角色名重复，请重新输入");
        } else {
            edu991Dao.save(edu991);
            resultVO = ResultVO.setSuccess("操作成功",edu991.getBF991_ID());
        }
        return resultVO;
    }

    // 删除角色
    public ResultVO removeRole(List<String> roleIdList) {
        ResultVO resultVO;
        // 查看角色当前是否有人使用
        for (String s : roleIdList) {
            List<Edu992> edu992List = edu992Dao.findInfoByEdu991Id(s);
            if (edu992List.size() != 0) {
                resultVO = ResultVO.setFailed("所选角色中存在正在使用的角色，无法删除");
                return resultVO;
            }
        }

        for (String s : roleIdList) {
            //删除关联表
            edu992Dao.deleteByEdu991Id(s);
            //删除主表
            edu991Dao.removeRole(s);
        }
        resultVO = ResultVO.setSuccess("共计删除了"+roleIdList.size()+"个角色");
        return resultVO;
    }

    // 获取所有角色
    public ResultVO getAllRole() {
       ResultVO resultVO;
       Map<String,Object> returnMap = new HashMap<>();
       List<Edu991> edu991List = edu991Dao.findRoleWithoutSys();
       if (edu991List.size() == 0) {
           resultVO = ResultVO.setFailed("暂无角色信息");
           return resultVO;
       } else {
           returnMap.put("allRole",edu991List);
       }
        List<Edu104> allDepartment = edu104Dao.findAll();
        if (allDepartment.size() == 0) {
            resultVO = ResultVO.setFailed("暂无二级学院信息");
            return resultVO;
        } else {
            returnMap.put("allDepartment",allDepartment);
        }
        resultVO = ResultVO.setSuccess("查询成功",returnMap);
        return resultVO;
    }

    // 查询所有用户
    public ResultVO queryAllUser() {
        ResultVO resultVO;
        List<Edu990PO> edu990POS = new ArrayList<>();
        List<Edu990> edu990List = edu990Dao.findUserWithoutSys();
        if (edu990List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无用户信息");
            return resultVO;
        } else {
            for (Edu990 edu990:edu990List) {
                Edu990PO edu990PO = new Edu990PO();
                String userId = edu990.getBF990_ID().toString();
                try {
                    utils.copyTargetSuper(edu990,edu990PO);
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                }
                edu990POS.add(edu990PO);
            }
            resultVO = ResultVO.setSuccess("共找到" + edu990List.size() + "个用户", edu990POS);
        }

        return resultVO;
    }

    // 根据用户id查询用户信息
    public ResultVO queryUserById(String userId) {
        ResultVO resultVO;
        Edu990 edu990 = edu990Dao.queryUserById(userId);
        if (edu990.getBF990_ID() == null) {
            resultVO = ResultVO.setFailed("该用户信息有误,请联系管理员处理");
        } else {
            resultVO = ResultVO.setSuccess("查询成功",edu990);
        }
        return resultVO;
    }

    //检查用户名是否存在
    public  List<Edu990> checkUserName(Edu990 edu990){
        Specification<Edu990> specification = new Specification<Edu990>() {
            public Predicate toPredicate(Root<Edu990> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu990.getBF990_ID() != null && !"".equals(edu990.getBF990_ID())) {
                    predicates.add(cb.notEqual(root.<String> get("BF990_ID"), edu990.getBF990_ID()));
                }
                if (edu990.getYhm() != null && !"".equals(edu990.getYhm())) {
                    predicates.add(cb.equal(root.<String> get("yhm"), edu990.getYhm()));
                }
                return cb.and(predicates.toArray(new Predicate[predicates.size()]));
            }
        };
        List<Edu990> edu990List = edu990Dao.findAll(specification);
        return edu990List;
    }

    // 新建或修改用户
    public ResultVO newUser(Edu990 edu990) {
        ResultVO resultVO;
        // 判断用户名是否存在
        List<Edu990> edu990List = checkUserName(edu990);
        if (edu990List.size() != 0) {
            resultVO = ResultVO.setFailed("用户名已存在,请重新输入");
        }else {
            //保存用户
            edu990Dao.save(edu990);
            //删除已有关联
            edu992Dao.deleteByEdu990Id(edu990.getBF990_ID().toString());
            String[] jsids = edu990.getJsId().split(",");
            //添加新关联
            for (String s : jsids) {
                Edu992 edu992 = new Edu992();
                edu992.setBF991_ID(Long.parseLong(s));
                edu992.setBF990_ID(edu990.getBF990_ID());
                edu992Dao.save(edu992);
            }

            //添加用户与学院关系
            edu994Dao.deleteByEdu990Id(edu990.getBF990_ID().toString());
            if(edu990.getDeparmentIds() != null) {
                String[] departmentList = edu990.getDeparmentIds().split(",");
                for(String s: departmentList) {
                    Edu994 edu994 = new Edu994();
                    edu994.setEdu990_ID(edu990.getBF990_ID());
                    edu994.setEdu104_ID(s);
                    edu994Dao.save(edu994);
                }
            }

            resultVO = ResultVO.setSuccess("操作已成功",edu990.getBF990_ID());
        }
        return resultVO;
    }

    // 删除用户
    public ResultVO removeUser(List<String> removeList) {
        ResultVO resultVO;
        for (String s : removeList) {
            edu994Dao.deleteByEdu990Id(s);
            edu992Dao.deleteByEdu990Id(s);
            edu990Dao.removeUser(s);
        }
        resultVO = ResultVO.setSuccess("共删除了"+removeList.size()+"个用户");
        return resultVO;
    }


    //分页查询用户信息
    public ResultVO queryUserList(Integer pageNum, Integer pageSize) {
        ResultVO resultVO;
        Map<String, Object> returnMap = new HashMap<>();
        List<Edu001> edu001List = edu001Dao.findAllInPage(pageNum,pageSize);
        long count = edu001Dao.count();
        if(edu001List.size() == 0) {
            resultVO = ResultVO.setFailed("暂无用户信息");
        } else {
            returnMap.put("rows",edu001List);
            returnMap.put("total",count);
            resultVO = ResultVO.setSuccess("查询成功",returnMap);
        }
        return resultVO;
    }
}
