package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu005;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu005Dao extends JpaRepository<Edu005, Long>, JpaSpecificationExecutor<Edu005> {
    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu005 where Edu201_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String scheduleId);

    //根据学生ID查询成绩和学分
    @Query(value = "select f.* from edu005 f where f.EDU001_ID = ?1 and f.EDU201_ID in ?2",nativeQuery = true)
    List<Edu005> findAllByStudent(String userKey,List<Long> edu201Ids);

    //根据任务书查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where t.Edu201_ID =?1",nativeQuery = true)
    String countAllByEdu201(Long edu201Id);

    //根据任务书查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where t.Edu201_ID =?1 and t.is_passed = 'T'",nativeQuery = true)
    String countPassByEdu201(Long edu201Id);

    //根据条件检索成绩
    @Query(value = "select * from edu005 t where t.xn = ?1 and t.class_name = ?2 and t.course_name = ?3 and t.student_code = ?4 ",nativeQuery = true)
    Edu005 findOneBySearchInfo(String xn, String className, String courseName, String studentCode);

    //根据条件检索成绩2
    @Query(value = "select * from edu005 t where t.xn = ?1 and t.class_name = ?2 and t.course_name = ?3 and t.student_code = ?4 and EDU201_ID in (select distinct e.Edu201_ID from edu205 e where e.Edu101_ID = ?5)",nativeQuery = true)
    Edu005 findOneBySearchInfo2(String xn, String className, String courseName, String studentCode,String teacherId);

    //更新确认标识
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update edu005 t set t.is_confirm = 'T' where t.Edu005_ID in ?1", nativeQuery = true)
    void updateConfirmGrade(List<Long> confirmIdList);

    //更新补考标识
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update edu005 t set t.is_resit = ?2 where t.Edu005_ID in ?1", nativeQuery = true)
    void updateResitFlag(List<Long> noPassIdList,String passFlag);


    //根据学生主键删除成绩表信息
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from edu005 where Edu001_ID = ?1", nativeQuery = true)
    void deleteByEdu001Id(Long edu001_id);


    //取消成绩确认和补考标识
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update edu005 t set t.is_resit = null , t.is_confirm = null where t.xnid = ?1 and t.course_name = ?2 and t.class_name = ?3", nativeQuery = true)
    void cancelGradeInfo(String xnid, String courseName, String className);

    //根据班级、学科查询成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from EDU005 where CLASS_NAME = ?1 and COURSE_NAME = ?2", nativeQuery = true)
    List<Edu005> studentGetGradesByClass(String className,String courseName);

    //导出成绩excel
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from edu005 where edu300_ID = ?1 and xnid = ?2 and COURSE_NAME in (?3) ORDER BY STUDENT_CODE,COURSE_NAME", nativeQuery = true)
    List<Edu005> getExportGrade(String classes,String trem,List<String> list);


    //修改免修类型
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE edu005 set IS_MX = ?2 WHERE Edu005_ID =?1", nativeQuery = true)
    void updateMXStatus(String edu005_ID,String mxStatus);

    //根据课程名称和生源类型更新免修状态
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "UPDATE (select e.* from edu005 e LEFT JOIN edu001 ee on e.EDU001_ID = ee.EDU001_ID where ee.sylxbm = ?2 and COURSE_NAME in ?1 and e.xnid = ?3 and (is_mx != '01' or is_mx is null)) a set a.is_mx = '01'", nativeQuery = true)
    void updateMXStatusByCourse(List<String> courserName,String sylxbm,String trem);

    //根据课程名称和生源类型查询成绩
    @Query(value = "select count(*) from edu005 e LEFT JOIN edu001 ee on e.EDU001_ID = ee.EDU001_ID where ee.sylxbm = ?2 and COURSE_NAME in ?1 and e.xnid = ?3 and (is_mx != '01' or is_mx is null)", nativeQuery = true)
    Integer selectMXStatusByCourse(List<String> courserName,String sylxbm,String trem);

    //查询溯源数据
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "SELECT * FROM EDU005 where grade < 60 and EDU005_ID not in (select EDU005_ID from EDU0051) and is_resit = 'T'", nativeQuery = true)
    List<Edu005> rootsData();


    //导出不及格成绩excel模板
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from edu005 where  is_Confirm = 'T' and ((is_Exam_Crouse = 'F' and (grade != 'T' or grade is null )) or (is_Exam_Crouse = 'T' and grade <60)) and xnid = ?1 and COURSE_NAME in ?2 and EDU300_ID  in ?3 and EDU201_ID in (select distinct e.Edu201_ID from edu205 e where e.Edu101_ID = ?4) order by CLASS_NAME", nativeQuery = true)
    List<Edu005> exportMakeUpGradeCheckModel(String classes,List<String> trem,List<String> list,String edu101Id);

    //导出不及格成绩excel模板
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from edu005 where  is_Confirm = 'T' and ((is_Exam_Crouse = 'F' and (grade != 'T' or grade is null )) or (is_Exam_Crouse = 'T' and grade <60)) and xnid = ?1 and COURSE_NAME in ?2 and EDU201_ID in (select distinct e.Edu201_ID from edu205 e where e.Edu101_ID = ?3) order by CLASS_NAME", nativeQuery = true)
    List<Edu005> exportMakeUpGradeCheckModel(String classes,List<String> trem,String edu101Id);


    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from edu005 where edu101_id is null", nativeQuery = true)
    List<Edu005> addEdu101Id();

    //确认成绩时检查是否有遗漏
    @Query(value = "select * from edu005 where EDU005_ID in ?1 and  (is_mx is null or is_mx = '0') and grade is null", nativeQuery = true)
    List<Edu005> findConfirmGrade(List<Long> confirmIdList);
}

