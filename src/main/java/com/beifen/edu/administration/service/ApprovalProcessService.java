package com.beifen.edu.administration.service;

import com.beifen.edu.administration.PO.Edu600BO;
import com.beifen.edu.administration.PO.Edu601PO;
import com.beifen.edu.administration.VO.ResultVO;
import com.beifen.edu.administration.constant.RedisDataConstant;
import com.beifen.edu.administration.dao.*;
import com.beifen.edu.administration.domian.*;
import com.beifen.edu.administration.utility.RedisUtils;
import com.beifen.edu.administration.utility.ReflectUtils;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;
import java.util.*;
import java.util.stream.Collectors;


/**
 * 审批流程事务控制层
 */
@Configuration
@Service
public class ApprovalProcessService {

    @Autowired
    private Edu600Dao edu600DAO;
    @Autowired
    private Edu602Dao edu602Dao;
    @Autowired
    private Edu601Dao edu601Dao;
    @Autowired
    private Edu990Dao edu990Dao;
    @Autowired
    private Edu000Dao edu000Dao;
    @Autowired
    private Edu200Dao edu200Dao;
    @Autowired
    private Edu108Dao edu108Dao;
    @Autowired
    private Edu201Dao edu201Dao;
    @Autowired
    private Edu001Dao edu001Dao;
    @Autowired
    private Edu101Dao edu101Dao;
    @Autowired
    private Edu107Dao edu107Dao;
    @Autowired
    private Edu112Dao edu112Dao;
    @Autowired
    private Edu115Dao edu115Dao;
    @Autowired
    private Edu008Dao edu008Dao;
    @Autowired
    private StaffManageService staffManageService;
    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private ReflectUtils utils;

    /**
     * 发起审批流程
     * @param edu600
     * @return
     */
    public boolean initiationProcess(Edu600 edu600) {
        boolean isSuccess;
        edu600.setCurrentRole(edu600.getProposerType());
        edu600.setExaminerkey(edu600.getProposerKey());
        edu600.setApprovalState("0");
        edu600.setApprovalEnd("F");
        edu600.setCreatDate(new Date());
        edu600.setUpdateDate(new Date());
        edu600.setIsDelete("F");
        Long businessKey = edu600.getBusinessKey();
        String businessType = edu600.getBusinessType();
        String keyWord = creatApprovalKeyWord(businessKey,businessType);
        edu600.setKeyWord(keyWord);

        edu600.setDepartmentCode(searchBusinessDepartment(businessType,businessKey));


        //保存审批信息
        Edu600 newEdu600 = edu600DAO.save(edu600);
        //保存历史审批记录
        Edu601 edu601 = saveApprovalHistory(edu600, "0");

//        if("05".equals(edu600.getBusinessType())) {
//            edu001Dao.updateState(edu600.getBusinessKey().toString(),"007", "休学申请中");
//        }

        //进入流转将当前节点变为下一节点
        edu600.setLastRole(edu600.getProposerType());
        edu600.setLastExaminerKey(edu600.getProposerKey());
        //开始流转
        isSuccess = processFlow(newEdu600, "1");

        if(!isSuccess) {
            edu601Dao.delete(edu601.getEdu601Id());
            edu600DAO.delete(edu600.getEdu600Id());
        }

       return isSuccess;

    }

    public String searchBusinessDepartment(String businessType,Long businessKey) {
        String department;
        switch (businessType) {
            case"01":
            case"02":
                Edu200 edu200 = edu200Dao.findOne(businessKey);
                department = edu200.getDepartmentCode();
                break;
            case"03":
                Edu107 edu107 = edu107Dao.findOne(businessKey);
                department = edu107.getEdu104();
                break;
            case"04":
                Edu201 edu201 = edu201Dao.findOne(businessKey);
                Edu108 edu1081 = edu108Dao.findOne(edu201.getEdu108_ID());
                Edu107 edu1071 = edu107Dao.findOne(edu1081.getEdu107_ID());
                department = edu1071.getEdu104();
                break;
            case"05":
                Edu001 edu001 = edu001Dao.findOne(businessKey);
                department = edu001.getSzxb();
                break;
            case"07":
                Edu101 edu101 = edu101Dao.findOne(businessKey);
                department = edu101.getSzxb();
                break;
            case"06":
                Edu112 edu112 = edu112Dao.findOne(businessKey);
                Edu990 edu990 = edu990Dao.findOne(edu112.getEdu990_ID());
                Edu101 one = edu101Dao.findOne(Long.parseLong(edu990.getUserKey()));
                department = one.getSzxb();
                break;
            case"08":
                Edu008 edu008 = edu008Dao.findOne(businessKey);
                department = edu008.getDepartmentCode();
                break;
            case"09":
                Edu115 edu115 = edu115Dao.findOne(businessKey);
                Edu990 edu9901 = edu990Dao.findOne(edu115.getEdu990_ID());
                Edu101 one1 = edu101Dao.findOne(Long.parseLong(edu9901.getUserKey()));
                department = one1.getSzxb();
                break;
            default:
                department = "0000";
                break;
        }

        return department;
    }


    public String creatApprovalKeyWord(Long businessKey,String businessType){
        String keyWord = "";
        switch(businessType) {
            case"01":
            case"02":
                Edu200 edu200 = edu200Dao.findOne(businessKey);
                keyWord = edu200.getKcmc();
                break;
            case"03":
                Edu107 edu107 = edu107Dao.findOne(businessKey);
                keyWord = edu107.getPyjhmc();
                break;
            case"04":
                Edu201 edu201 = edu201Dao.findOne(businessKey);
                keyWord = edu201.getClassName()+"教学任务书";
                break;
            case"05":
                Edu001 edu001 = edu001Dao.findOne(businessKey);
                keyWord = edu001.getXm();
                break;
            case"06":
                Edu112 edu112 = edu112Dao.findOne(businessKey);
                keyWord = edu112.getDestination();
                break;
            case"07":
                Edu101 edu101 = edu101Dao.findOne(businessKey);
                keyWord = edu101.getXm();
                break;
            case"08":
                Edu008 edu008 = edu008Dao.findOne(businessKey);
                keyWord = edu008.getClassName()+edu008.getCourseName();
                break;
            case"09":
                Edu115 edu115 = edu115Dao.findOne(businessKey);
                keyWord = edu115.getClassName()+edu115.getCourseName();
                break;
            default:
                keyWord = "未知类型";
                break;
        }
        return keyWord;
    }

    /**
     *
     * @param edu600
     * @param approvalFlag
     * @return
     */
    public Edu601 saveApprovalHistory(Edu600 edu600,String approvalFlag) {
        //初始化成功标识和审批历史记录实体类
        Edu601 edu601 = new Edu601();

        //复制属性并存储历史审批记录
        try {
            BeanUtils.copyProperties(edu601, edu600);
            edu601.setUpdateDate(new Date());
            edu601.setApprovalResult(approvalFlag);
            edu601Dao.save(edu601);
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        return edu601;

    }

    /**
     * 审批流转控制
     * @param edu600
     * @param approvalFlag
     * @return
     */
    private boolean processFlow(Edu600 edu600, String approvalFlag) {
        //初始化成功标识
        boolean isSuccess = true;
        //获取审批信息
        String businessType = edu600.getBusinessType();//业务类型
        Long lastRole = edu600.getLastRole();//上一步审批人

       if("1".equals(approvalFlag)){
            //根据审批信息查找流转节点
            Edu602 edu602 = edu602Dao.selectNextRole(businessType, lastRole.toString());
            if(edu602 == null) {
                isSuccess =  false;
                return isSuccess;
            } else {
                //更新同意审批信息
                edu600.setCurrentRole(edu602.getNextRole());
                edu600.setLastRole(edu602.getCurrentRole());
                edu600.setApprovalState("1");
                edu600.setLastApprovalOpinions(edu600.getApprovalOpinions());
                edu600.setApprovalOpinions("");
                edu600.setUpdateDate(new Date());
                Edu600 save = edu600DAO.save(edu600);
                if(save == null){
                    isSuccess = false;
                    return isSuccess;
                }
            }
        } else if("2".equals(approvalFlag)) {
            //更新不同意审批信息
            edu600.setApprovalState("2");
            edu600.setCurrentRole(edu600.getProposerType());
            edu600.setLastRole(edu600.getCurrentRole());
            edu600.setApprovalState("2");
            edu600.setLastApprovalOpinions(edu600.getApprovalOpinions());
            edu600.setApprovalOpinions("");
            edu600.setUpdateDate(new Date());
            Edu600 save = edu600DAO.save(edu600);
            if(save == null){
                isSuccess = false;
                return isSuccess;
            }
        } else if("3".equals(approvalFlag)){
           //更新追回审批信息
           Edu600 eud600select = new Edu600();
           eud600select.setLastExaminerKey(edu600.getExaminerkey());
           eud600select.setBusinessKey(edu600.getBusinessKey());
           eud600select.setEdu600Id(edu600.getEdu600Id());
           Specification<Edu601> specification = new Specification<Edu601>() {
               public Predicate toPredicate(Root<Edu601> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                   List<Predicate> predicates = new ArrayList<Predicate>();
                   if (eud600select.getBusinessKey() != null && !"".equals(eud600select.getBusinessKey())) {
                       predicates.add(cb.equal(root.<String> get("businessKey"), edu600.getBusinessKey()));
                   }
                   if (eud600select.getLastExaminerKey() != null && !"".equals(eud600select.getLastExaminerKey())) {
                       predicates.add(cb.equal(root.<String> get("lastExaminerKey"), eud600select.getLastExaminerKey()));
                   }
                   if (eud600select.getEdu600Id() != null && !"".equals(eud600select.getEdu600Id())) {
                       predicates.add(cb.equal(root.<String> get("edu600Id"), eud600select.getEdu600Id()));
                   }
                   return cb.and(predicates.toArray(new Predicate[predicates.size()]));
               }
           };
           List<Edu601> edu601List = edu601Dao.findAll(specification);
           Edu601 edu601 = edu601List.get(0);
           try {
               //复制属性
               BeanUtils.copyProperties(edu600, edu601);
               Edu602 edu602 = edu602Dao.selectNextRole(businessType, edu600.getLastRole().toString());
               edu600.setCurrentRole(edu602.getCurrentRole());
               edu600.setLastRole(edu602.getLastRole());
           } catch (IllegalAccessException e) {
               e.printStackTrace();
           } catch (InvocationTargetException e) {
               e.printStackTrace();
           }

           if(edu600.getCurrentRole() == edu600.getProposerType()){
              edu600.setApprovalState("2");
           }

           edu600.setUpdateDate(new Date());
           Edu600 save = edu600DAO.save(edu600);
           if(save == null){
               isSuccess = false;
               return isSuccess;
           }
       } else {
           isSuccess = false;
           return isSuccess;
       }

       //审批结束回写数据
       if ("0".equals(edu600.getCurrentRole().toString()) || !"1".equals(approvalFlag) || edu600.getCurrentRole().equals(edu600.getProposerType())){
           edu600.setApprovalEnd("T");
           edu600DAO.save(edu600);
           isSuccess=writeBackData(edu600,approvalFlag);
       }

        return isSuccess;
    }

    /**
     * 最后一个节点的数据审批
     * @param edu600
     * @param approvalFlag
     * @return
     */
    private boolean writeBackData(Edu600 edu600, String approvalFlag) {
        boolean isSuccess = true;
        String businessKey = edu600.getBusinessKey().toString();
        String bussinessType = edu600.getBusinessType();
        //根据审批结果回写业务状态,1同意2不同意3追回
        if("1".equals(approvalFlag)) {
            switch(bussinessType) {
                case"01":
                    edu200Dao.updateState(businessKey, "pass");
                    break;
                case"02":
                    edu200Dao.updateState(businessKey, "stop");
                    break;
                case"03":
                    edu107Dao.changeProcessState("pass",businessKey);
                    break;
                case"04":
                    edu201Dao.updateState(businessKey, "pass");
                    break;
                case"05":
                    edu001Dao.updateState(businessKey, "002", "休学");
                    break;
                case"06":
                    edu112Dao.updateState(businessKey, "pass");
                    break;
                case"07":
                    edu101Dao.updateState(businessKey, "pass");
                    break;
                case"08":
                    staffManageService.cancelGradeInfo(businessKey);
                    break;
                case"09":
                    edu115Dao.updateState(businessKey, "pass");
                    break;
                default:
                    isSuccess = false;
                    break;

            }
        } else if("2".equals(approvalFlag)) {
            switch(bussinessType) {
                case"01":
                    edu200Dao.updateState(businessKey, "nopass");
                    break;
                case"02":
                    edu200Dao.updateState(businessKey, "pass");
                    break;
                case"03":
                    edu107Dao.changeProcessState("nopass",businessKey);
                    break;
                case"04":
                    edu201Dao.updateState(businessKey, "nopass");
                    break;
                case"05":
                    edu001Dao.updateState(businessKey, "001", "在读");
                    break;
                case"06":
                    edu112Dao.updateState(businessKey, "nopass");
                    break;
                case"07":
                    edu101Dao.updateState(businessKey, "nopass");
                    break;
                case"08":
                    break;
                default:
                    isSuccess = false;
                    break;
            }
        } else if("3".equals(approvalFlag) && edu600.getCurrentRole().equals(edu600.getProposerType())){
            switch(bussinessType) {
                case"01":
                    edu200Dao.updateState(businessKey, "nopass");
                    break;
                case"02":
                    edu200Dao.updateState(businessKey, "pass");
                    break;
                case"03":
                    edu107Dao.changeProcessState("nopass",businessKey);
                    break;
                case"04":
                    edu201Dao.updateState(businessKey, "nopass");
                    break;
                case"05":
                    edu001Dao.updateState(businessKey, "001", "在读");
                    break;
                case"06":
                    edu112Dao.updateState(businessKey, "nopass");
                    break;
                case"07":
                    edu101Dao.updateState(businessKey, "nopass");
                    break;
                case"08":
                    break;
                default:
                    isSuccess = false;
                    break;
            }
        }

        return isSuccess;
    }


    /**
     * 搜索审批信息
     * @param edu600BO
     * @return
     */
    public ResultVO searchApproval(Edu600BO edu600BO) {
        ResultVO resultVO;

        Edu600 edu600 = new Edu600();
        List<Edu600BO> approvalExList = new ArrayList<>();

        try {
            //复制属性并赋值新属性
            BeanUtils.copyProperties(edu600,edu600BO);

            //赋值查询条件
            edu600.setCurrentRole(edu600BO.getCurrentUserRole());

            String userId = edu600.getExaminerkey().toString();
            //从redis中查询二级学院管理权限
            List<String> departments = (List<String>) redisUtils.get(RedisDataConstant.DEPATRMENT_CODE + userId);

            Specification<Edu600> specification = new Specification<Edu600>() {
                public Predicate toPredicate(Root<Edu600> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    if (edu600.getCurrentRole() != null && !"".equals(edu600.getCurrentRole())) {
                        predicates.add(cb.equal(root.<String> get("currentRole"), edu600.getCurrentRole()));
                    }
                    if (edu600.getBusinessType() != null && !"".equals(edu600.getBusinessType())) {
                        predicates.add(cb.equal(root.<String> get("businessType"), edu600.getBusinessType()));
                    }
                    if (edu600.getProposerKey() != null && !"".equals(edu600.getProposerKey())) {
                        predicates.add(cb.equal(root.<String> get("proposerKey"), edu600.getProposerKey()));
                    }
                    predicates.add(cb.equal(root.<String> get("isDelete"), "F"));
                    Path<Object> path = root.get("departmentCode");//定义查询的字段
                    CriteriaBuilder.In<Object> in = cb.in(path);
                    for (int i = 0; i <departments.size() ; i++) {
                        in.value(departments.get(i));//存入值
                    }
                    predicates.add(cb.and(in));

                    predicates.add(cb.notEqual(root.<String> get("currentRole"),root.<String> get("proposerType")));

                    query.where(cb.and(predicates.toArray(new Predicate[predicates.size()])));
                    query.orderBy(cb.desc(root.get("creatDate").as(Date.class)));

                    return query.getRestriction();
                }
            };

            List<Edu600> aprovalList = edu600DAO.findAll(specification);

            if (aprovalList.size() == 0) {
                resultVO = ResultVO.setFailed("暂无可审批信息");
                return resultVO;
            }

            for (Edu600 e :  aprovalList) {
                Edu600BO approvalEx = new Edu600BO();
                //赋值已有属性
                BeanUtils.copyProperties(approvalEx,e);
                //查询申请人信息
                Edu990 proposer = edu990Dao.queryUserById(e.getProposerKey().toString());
                Edu101 edu101 = edu101Dao.findOne(Long.parseLong(proposer.getUserKey()));
                approvalEx.setProposerName(edu101.getXm());
                //获取上一步审批人信息
                if(e.getLastExaminerKey() == null || "".equals(e.getExaminerkey())) {
                    approvalEx.setLastPersonName("");
                }else {
                    Edu990 lastPerson = edu990Dao.queryUserById(e.getLastExaminerKey().toString());
                    Edu101 edu1011 = edu101Dao.findOne(Long.parseLong(lastPerson.getUserKey()));
                    approvalEx.setLastPersonName(edu1011.getXm());
                }
                //获取业务类型信息
                String splx = edu000Dao.queryEjdmMcByEjdmZ(e.getBusinessType(), "splx");
                approvalEx.setBusinessName(splx);
                //将封装数据加入数组
                approvalExList.add(approvalEx);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        resultVO = ResultVO.setSuccess("共找到"+approvalExList.size()+"条记录",approvalExList);
        return resultVO;
    }

    /**
     * 搜索审批人
     * @return
     */
    public List<Edu990> getProposerList() {
        //查找申请表中涉及到的审批人
        List<Edu990> proposerList = edu990Dao.selectProposer();
        List list = utils.heavyListMethod(proposerList);
        return list;
    }

    /**
     * 审批操作
     * @param edu600BO
     * @return
     */
    public boolean approvalOperation(Edu600BO edu600BO) {
        boolean isSuccess = true;
        Edu600 edu600 = new Edu600();
        String approvalFlag = edu600BO.getApprovalFlag();

        try {
            BeanUtils.copyProperties(edu600,edu600BO);
            //流转前保存审批记录
            edu600.setApprovalState(approvalFlag);
            Edu601 edu601 = saveApprovalHistory(edu600, approvalFlag);
            //进入流转将当前节点变为上一节点
            edu600.setLastRole(edu600BO.getCurrentRole());
            edu600.setLastExaminerKey(edu600BO.getExaminerkey());
            isSuccess = processFlow(edu600, approvalFlag);
            if(!isSuccess) {
                edu601Dao.delete(edu601.getEdu601Id());
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return isSuccess;
    }

    /**
     * 搜索可追回审批记录
     * @param edu600BO
     * @return
     */
    public List<Edu600BO> searchCanBackApproval(Edu600BO edu600BO) {
        List<Edu600BO> approvalExList = new ArrayList<>();
        try {
            //赋值查询条件
            Edu600 edu600 = new Edu600();
            edu600.setLastRole(edu600BO.getCurrentUserRole());
            edu600.setProposerKey(edu600BO.getProposerKey());
            edu600.setBusinessType(edu600BO.getBusinessType());
            edu600.setLastExaminerKey(edu600BO.getExaminerkey());

            Specification<Edu600> specification = new Specification<Edu600>() {
                public Predicate toPredicate(Root<Edu600> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                    List<Predicate> predicates = new ArrayList<Predicate>();
                    if (edu600.getBusinessType() != null && !"".equals(edu600.getBusinessType())) {
                        predicates.add(cb.equal(root.<String> get("businessType"), edu600.getBusinessType()));
                    }
                    if (edu600.getProposerKey() != null && !"".equals(edu600.getProposerKey())) {
                        predicates.add(cb.equal(root.<String> get("proposerKey"), edu600.getProposerKey()));
                    }
                    if (edu600.getLastExaminerKey() != null && !"".equals(edu600.getLastExaminerKey())) {
                        predicates.add(cb.equal(root.<String> get("lastExaminerKey"), edu600.getLastExaminerKey()));
                    }
                    if (edu600.getLastRole() != null && !"".equals(edu600.getLastRole())) {
                        predicates.add(cb.equal(root.<String> get("lastRole"), edu600.getLastRole()));
                        predicates.add(cb.notEqual(root.<String> get("currentRole"),edu600.getLastRole()));
                    }
                    predicates.add(cb.notEqual(root.<String> get("currentRole"),"0"));
                    predicates.add(cb.notEqual(root.<String> get("currentRole"),root.<String> get("proposerType")));
                    predicates.add(cb.notEqual(root.<String> get("approvalEnd"),"T"));

                    return cb.and(predicates.toArray(new Predicate[predicates.size()]));
                }
            };

            List<Edu600> aprovalList = edu600DAO.findAll(specification);

            for (Edu600 e :  aprovalList) {
                Edu600BO approvalEx = new Edu600BO();
                //赋值已有属性
                BeanUtils.copyProperties(approvalEx,e);
                //查询申请人信息
                Edu990 proposer = edu990Dao.queryUserById(e.getProposerKey().toString());
                Edu101 edu101 = edu101Dao.findOne(Long.parseLong(proposer.getUserKey()));
                approvalEx.setProposerName(edu101.getXm());
                //获取上一步审批人信息
                if(e.getLastExaminerKey() == null || "".equals(e.getExaminerkey())) {
                    approvalEx.setLastPersonName("");
                }else {
                    Edu990 lastPerson = edu990Dao.queryUserById(e.getLastExaminerKey().toString());
                    Edu101 edu1011 = edu101Dao.findOne(Long.parseLong(lastPerson.getUserKey()));
                    approvalEx.setLastPersonName(edu1011.getXm());
                }
                //获取业务类型信息
                String splx = edu000Dao.queryEjdmMcByEjdmZ(e.getBusinessType(), "splx");
                approvalEx.setBusinessName(splx);
                //将封装数据加入数组
                approvalExList.add(approvalEx);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
        return approvalExList;
    }


    /**
     * 获取审批业务详情
     * @param edu600BO
     * @return
     */
    public Object getApprovalDeatils(Edu600BO edu600BO) {
        String businessType = edu600BO.getBusinessType();
        String businessKey = edu600BO.getBusinessKey().toString();
        Object object = new Object();
        switch (businessType) {
            case"01":
            case"02":
                object = edu200Dao.queryClassById(businessKey);
                break;
            case"03":
                List<Edu108> edu108List = edu108Dao.getEdu108ByEdu107Id(businessKey);
                object = edu108List;
                break;
            case"04":
                object = edu201Dao.getTaskById(businessKey);
                break;
            case"05":
                object = edu001Dao.queryStudentBy001ID(businessKey);
                break;
            case"06":
                object = edu112Dao.queryTeacherBusinessById(businessKey);
                break;
            case"07":
                object = edu101Dao.queryTeacherBy101ID(businessKey);
                break;
            case"08":
                object = edu008Dao.findOne(Long.parseLong(businessKey));
                break;
            default:
                break;
        }
        return object;
    }

    /**
     * 获取审批历史记录分组
     * @param edu600BO
     * @return
     */
    public List<Edu601PO> getApprovalHistory(Edu600BO edu600BO) {
        List<Edu601> historyList;
        List<Edu601PO> historyListEx = new ArrayList<>();

        Specification<Edu601> specification = new Specification<Edu601>() {
            public Predicate toPredicate(Root<Edu601> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<Predicate>();
                if (edu600BO.getBusinessType() != null && !"".equals(edu600BO.getBusinessType())) {
                    predicates.add(cb.equal(root.<String> get("businessType"), edu600BO.getBusinessType()));
                }
                if (edu600BO.getProposerKey() != null && !"".equals(edu600BO.getProposerKey())) {
                    predicates.add(cb.equal(root.<String> get("proposerKey"), edu600BO.getProposerKey()));
                }
                if (edu600BO.getExaminerkey() != null && !"".equals(edu600BO.getExaminerkey())) {
                    predicates.add(cb.equal(root.<String> get("examinerkey"), edu600BO.getExaminerkey()));
                }

                query.where(cb.and(predicates.toArray(new Predicate[predicates.size()])));
                query.orderBy(cb.desc(root.get("creatDate").as(Date.class)));
                return query.getRestriction();
            }
        };

        historyList = edu601Dao.findAll(specification);
        //根据edu600Id去重
        historyList = historyList.stream().collect(Collectors.collectingAndThen(Collectors.toCollection(()
                -> new TreeSet<>(Comparator.comparing(Edu601 :: getEdu600Id))), ArrayList::new));
        try {
                for (Edu601 e :  historyList) {
                    Edu601PO approvalEx = new Edu601PO();
                    //赋值已有属性
                    BeanUtils.copyProperties(approvalEx,e);
                    //查询申请人信息
                    Edu990 proposer = edu990Dao.queryUserById(e.getProposerKey().toString());
                    Edu101 edu101 = edu101Dao.findOne(Long.parseLong(proposer.getUserKey()));
                    approvalEx.setProposerName(edu101.getXm());
                    //获取当前审批人信息
                    if(e.getExaminerkey() == null || "".equals(e.getExaminerkey())) {
                        approvalEx.setExaminerName("");
                    }else {
                        Edu990 lastPerson = edu990Dao.queryUserById(e.getExaminerkey().toString());
                        Edu101 edu1011 = edu101Dao.findOne(Long.parseLong(lastPerson.getUserKey()));
                        approvalEx.setExaminerName(edu1011.getXm());
                    }
                    //获取业务类型信息
                    String splx = edu000Dao.queryEjdmMcByEjdmZ(e.getBusinessType(), "splx");
                    approvalEx.setBusinessName(splx);
                    //将封装数据加入数组
                    historyListEx.add(approvalEx);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }

        return historyListEx;
    }

    /**
     * 获取审批历史记录分组
     * @param edu600BO
     * @return
     */
    public List<Edu601PO> getHistoryDetail(Edu600BO edu600BO) {
        List<Edu601PO> historyListEx = new ArrayList<>();

        List<Edu601> historyList = edu601Dao.getHistoryDetailByEdu600Id(edu600BO.getEdu600Id().toString());
        try {
            for (Edu601 e :  historyList) {
                Edu601PO approvalEx = new Edu601PO();
                //赋值已有属性
                BeanUtils.copyProperties(approvalEx,e);
                //查询申请人信息
                Edu990 proposer = edu990Dao.queryUserById(e.getProposerKey().toString());
                Edu101 edu101 = edu101Dao.findOne(Long.parseLong(proposer.getUserKey()));
                approvalEx.setProposerName(edu101.getXm());
                //获取当前审批人信息
                if(e.getExaminerkey() == null || "".equals(e.getExaminerkey())) {
                    approvalEx.setExaminerName("");
                }else {
                    Edu990 lastPerson = edu990Dao.queryUserById(e.getExaminerkey().toString());
                    Edu101 edu1011 = edu101Dao.findOne(Long.parseLong(lastPerson.getUserKey()));
                    approvalEx.setExaminerName(edu1011.getXm());
                }
                //获取业务类型信息
                String splx = edu000Dao.queryEjdmMcByEjdmZ(e.getBusinessType(), "splx");
                approvalEx.setBusinessName(splx);
                //将封装数据加入数组
                historyListEx.add(approvalEx);
            }
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }

        return historyListEx;
    }
}
