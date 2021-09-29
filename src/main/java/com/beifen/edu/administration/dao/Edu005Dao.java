package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu005;
import com.beifen.edu.administration.domian.Edu107;
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
    @Query(value = "update edu005 t set t.is_resit = null,t.is_confirm = null,t.GET_CREDIT= null,t.exam_num= null where t.xnid = ?1 and t.course_name = ?2 and t.class_name = ?3", nativeQuery = true)
    void cancelGradeInfo(String xnid, String courseName, String className);

    //取消成绩确认和补考标识（查询）
    @Query(value = "SELECT Edu005_id FROM EDU005 t where t.xnid = ?1 and t.course_name = ?2 and t.class_name = ?3", nativeQuery = true)
    List<String> cancelGradeInfoQuery(String xnid, String courseName, String className);

    //根据班级、学科查询成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from EDU005 where CLASS_NAME = ?1 and COURSE_NAME = ?2", nativeQuery = true)
    List<Edu005> studentGetGradesByClass(String className,String courseName);

    //根据班级、学科查询成绩
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select * from EDU005 where CLASS_NAME = ?1 and COURSE_NAME = ?2 and xnid = ?3", nativeQuery = true)
    List<Edu005> studentGetGradesByClassCourseXn(String className,String courseName,String xnid);

    //根据班级、学科查询成绩(补考)
    @Query(value = "select * from EDU005 where CLASS_NAME = ?1 and COURSE_NAME = ?2 and xnid = ?3 and IS_CONFIRM = 'T' and IS_RESIT = 'T' and (IS_MX = '0' or IS_MX is null)", nativeQuery = true)
    List<Edu005> studentGetGradesByClassCourseXn2(String className,String courseName,String xnid);

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

    //根据课程名称和生源类型更新免修状态
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update edu005 set GET_CREDIT = CREDIT where is_mx = '01'", nativeQuery = true)
    void updateGetCreditByMXStatus();

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


    //根据edu001Id检索学年list
    @Query(value = "select xnid from edu005  where EDU001_ID = ?1 GROUP BY xnid ORDER BY xnid",nativeQuery = true)
    List<String> findXNListByEdu001ID(String edu001Id);

    //根据edu001Id和学年检索学年list
    @Query(value = "select * from edu005  where EDU001_ID = ?1 and xnid = ?2",nativeQuery = true)
    List<Edu005> findXNListByEdu001IDAndXNID(String edu001Id,String xnid);

    //根据edu001Id和学年检索学年list
    @Query(value = "select sum(GET_CREDIT) from edu005  where EDU001_ID = ?1 and xnid = ?2",nativeQuery = true)
    String findGradeListByEdu001IDAndXNID(String edu001Id,String xnid);


    @Query(value = "select zxs from edu201 where EDU201_ID = ?1",nativeQuery = true)
    String findzxs(String edu201_id);

    @Query(value = "select kclx_code from Edu108 where Edu108_ID = (select Edu108_ID from edu201 where EDU201_ID = ?1)",nativeQuery = true)
    String findkclx(String edu201_id);

    @Query(value = "select * from edu005 where IS_RESIT = 'T' and Is_Confirm = 'T' and EXAM_NUM != '1'",nativeQuery = true)
    List<Edu005> updateMUData();

    @Query(value = "UPDATE edu005 SET EXAM_NUM = '1' WHERE IS_RESIT = 'T' and Is_Confirm = 'T' and EXAM_NUM != '1'",nativeQuery = true)
    List<Edu005> updateMUData2();

    @Query(value = "select * from EDU005 where CLASS_NAME = ?1 and COURSE_NAME = ?2 and IS_PASSED = 'F' and IS_CONFIRM = 'T' and IS_RESIT = 'T' and (IS_MX = '0' or IS_MX is null) and (EXAM_NUM != ?3 or EXAM_NUM is null)",nativeQuery = true)
    List<Edu005> entryMUGrades(String className,String courseName,String EXAM_NUM);

    @Query(value = "select * from EDU005 where IS_PASSED = 'F' and IS_CONFIRM = 'T' and IS_RESIT = 'T' and (IS_MX = '0' or IS_MX is null) and (EXAM_NUM != ?1 or EXAM_NUM is null) and xnid = ?2",nativeQuery = true)
    List<Edu005> endNewMUTime(String EXAM_NUM,String xnid);

    @Query(value = "SELECT\n" +
            "TO_CHAR(row_number() over(order by student_code)) EDU005_ID,\n" +
            "class_name,\n" +
            "student_code,\n" +
            "STUDENT_NAME,\n" +
            "TO_CHAR(sum(grade)) sum,\n" +
            "TO_CHAR(Round(avg(grade),2))  avg\n" +
            "FROM\n" +
            "edu005 \n" +
            "WHERE\n" +
            "EDU201_ID IN ( SELECT EDU201_ID FROM edu201 WHERE EDU108_ID IN ( SELECT EDU108_ID FROM edu108 WHERE EDU107_ID in ?1 ) AND SFSQKS = 'T') \n" +
            "AND IS_CONFIRM = 'T' \n" +
            "and XNID = ?2\n" +
            "GROUP BY\n" +
            "STUDENT_CODE,\n" +
            "STUDENT_NAME,\n" +
            "class_name\n" +
            "ORDER BY\n" +
            "avg(grade) DESC",nativeQuery = true)
    List<Object[]> searchProfessionalCourseResult(List<String> edu107_id,String xnid);


    @Query(value = "SELECT\n" +
            "TO_CHAR(row_number() over(order by student_code)) EDU005_ID,\n" +
            "class_name,\n" +
            "student_code,\n" +
            "STUDENT_NAME,\n" +
            "TO_CHAR(sum(grade)) sum,\n" +
            "TO_CHAR(Round(avg(grade),2))  avg\n" +
            "FROM\n" +
            "edu005 \n" +
            "WHERE\n" +
            "EDU201_ID IN ( SELECT EDU201_ID FROM edu201 WHERE EDU108_ID IN ( SELECT EDU108_ID FROM edu108 WHERE EDU107_ID = ?1 ) AND SFSQKS = 'T') \n" +
            "AND IS_CONFIRM = 'T' \n" +
            "and XNID = ?2\n" +
            "GROUP BY\n" +
            "STUDENT_CODE,\n" +
            "STUDENT_NAME,\n" +
            "class_name\n" +
            "ORDER BY\n" +
            "avg(grade) DESC",nativeQuery = true)
    List<Object[]> searchProfessionalCourseResult(String edu107_id,String xnid);

    @Query(value = "SELECT\n" +
            "TO_CHAR(row_number() over(order by student_code)) EDU005_ID,\n" +
            "class_name,\n" +
            "student_code,\n" +
            "STUDENT_NAME,\n" +
            "TO_CHAR(sum(grade)) sum,\n" +
            "TO_CHAR(Round(avg(grade),2))  avg\n" +
            "FROM\n" +
            "edu005 \n" +
            "WHERE\n" +
            "EDU201_ID IN ( SELECT EDU201_ID FROM edu201 WHERE EDU108_ID IN ( SELECT EDU108_ID FROM edu108 WHERE EDU107_ID in ?1 ) AND SFSQKS = 'T') \n" +
            "AND IS_CONFIRM = 'T' \n" +
            "and XNID = ?2\n" +
            "and STUDENT_NAME like %?3%\n" +
            "GROUP BY\n" +
            "STUDENT_CODE,\n" +
            "STUDENT_NAME,\n" +
            "class_name\n" +
            "ORDER BY\n" +
            "avg(grade) DESC",nativeQuery = true)
    List<Object[]> searchProfessionalCourseResult2(List<String> edu107_id,String xnid,String studentName);

    @Query(value = "SELECT\n" +
            "TO_CHAR(row_number() over(order by student_code)) EDU005_ID,\n" +
            "class_name,\n" +
            "student_code,\n" +
            "STUDENT_NAME,\n" +
            "TO_CHAR(sum(grade)) sum,\n" +
            "TO_CHAR(Round(avg(grade),2))  avg\n" +
            "FROM\n" +
            "edu005 \n" +
            "WHERE\n" +
            "EDU201_ID IN ( SELECT EDU201_ID FROM edu201 WHERE EDU108_ID IN ( SELECT EDU108_ID FROM edu108 WHERE EDU107_ID in ?1 ) AND SFSQKS = 'T') \n" +
            "AND IS_CONFIRM = 'T' \n" +
            "and XNID = ?2\n" +
            "and class_name like %?3%\n" +
            "GROUP BY\n" +
            "STUDENT_CODE,\n" +
            "STUDENT_NAME,\n" +
            "class_name\n" +
            "ORDER BY\n" +
            "avg(grade) DESC",nativeQuery = true)
    List<Object[]> searchProfessionalCourseResult3(List<String> edu107_id,String xnid,String className);

    @Query(value = "SELECT\n" +
            "TO_CHAR(row_number() over(order by student_code)) EDU005_ID,\n" +
            "class_name,\n" +
            "student_code,\n" +
            "STUDENT_NAME,\n" +
            "TO_CHAR(sum(grade)) sum,\n" +
            "TO_CHAR(Round(avg(grade),2))  avg\n" +
            "FROM\n" +
            "edu005 \n" +
            "WHERE\n" +
            "EDU201_ID IN ( SELECT EDU201_ID FROM edu201 WHERE EDU108_ID IN ( SELECT EDU108_ID FROM edu108 WHERE EDU107_ID in ?1 ) AND SFSQKS = 'T') \n" +
            "AND IS_CONFIRM = 'T' \n" +
            "and XNID = ?2\n" +
            "and class_name like %?3%\n" +
            "and STUDENT_NAME like %?4%\n" +
            "GROUP BY\n" +
            "STUDENT_CODE,\n" +
            "STUDENT_NAME,\n" +
            "class_name\n" +
            "ORDER BY\n" +
            "avg(grade) DESC",nativeQuery = true)
    List<Object[]> searchProfessionalCourseResult4(List<String> edu107_id,String xnid,String className,String studentName);

    //根据任务书查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where t.Edu201_ID =?1 and CLASS_NAME = ?2",nativeQuery = true)
    String countAllByEdu201AndClassname(Long edu201Id,String classname);

    //根据任务书查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where t.Edu201_ID =?1 and CLASS_NAME = ?2 and t.is_passed = 'T'",nativeQuery = true)
    String countPassByEdu201AndClassname(Long edu201Id,String classname);


    //详细课程
    @Query(value = "select course_name from edu005 where EDU201_ID IN ( SELECT EDU201_ID FROM edu201 WHERE EDU108_ID IN ( SELECT EDU108_ID FROM edu108 WHERE EDU107_ID = ?1 )) and XNID = ?2 group by course_name order by course_name",nativeQuery = true)
    List<String> findCourseListByEdu107Id(String edu107Id,String xnid);

    //根据studentCode,courseName,xnid查询
    @Query(value = "select * from edu005 where student_code = ?1 and xnid = ?3 and course_name = ?2",nativeQuery = true)
    Edu005 findedu005bySCX(String sutdentCode,String courseName,String xnid);

    //根据学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1)) and xnid = ?2) and IS_CONFIRM = 'T'",nativeQuery = true)
    String countAllByEdu104AndXN(Long edu104Id,String xnid,String edu103Id);

    //根据学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1)) and xnid = ?2) and IS_CONFIRM = 'T' and course_name = ?4",nativeQuery = true)
    String countAllByEdu104AndXN2(Long edu104Id,String xnid,String edu103Id,String courseName);

    //根据学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1)) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T'",nativeQuery = true)
    String countPassByEdu104AndXN(Long edu104Id,String xnid,String edu103Id);

    //根据学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1)) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T' and course_name = ?4",nativeQuery = true)
    String countPassByEdu104AndXN2(Long edu104Id,String xnid,String edu103Id,String courseName);

    //根据年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4)) and xnid = ?2) and IS_CONFIRM = 'T'",nativeQuery = true)
    String countAllByEdu104AndXN(Long edu104Id,String xnid,String edu103Id,String edu105);

    //根据年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4)) and xnid = ?2) and IS_CONFIRM = 'T' and course_name = ?5",nativeQuery = true)
    String countAllByEdu104AndXN2(Long edu104Id,String xnid,String edu103Id,String edu105,String courseName);

    //根据年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4)) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T'",nativeQuery = true)
    String countPassByEdu104AndXN(Long edu104Id,String xnid,String edu103Id,String edu105);

    //根据年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4)) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T' and course_name = ?5",nativeQuery = true)
    String countPassByEdu104AndXN2(Long edu104Id,String xnid,String edu103Id,String edu105,String courseName);

    //根据专业、年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4 and edu106 =?5)) and xnid = ?2) and IS_CONFIRM = 'T'",nativeQuery = true)
    String countAllByEdu106AndXN(Long edu104Id,String xnid,String edu103Id,String edu105,Long edu106Id);

    //根据专业、年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4 and edu106 =?5)) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T'",nativeQuery = true)
    String countPassByEdu106AndXN(Long edu104Id,String xnid,String edu103Id,String edu105,Long edu106Id);

    //根据专业、年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and xnid = ?2) and IS_CONFIRM = 'T'",nativeQuery = true)
    String countAllByEdu107AndXN(Long edu107Id,String xnid);

    //根据专业、年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T'",nativeQuery = true)
    String countPassByEdu107AndXN(Long edu107Id,String xnid);

    //根据专业、年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in ?1 and IS_CONFIRM = 'T'",nativeQuery = true)
    String countAllByEdu201AndXN(List<String> edu201ids);

    //根据专业、年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in ?1 and IS_CONFIRM = 'T' and IS_PASSED = 'T'",nativeQuery = true)
    String countPassByEdu201AndXN(List<String> edu201ids);

    //根据专业、年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4 and edu106 =?5)) and xnid = ?2) and IS_CONFIRM = 'T' and course_name = ?6",nativeQuery = true)
    String countAllByEdu106AndXN2(Long edu104Id,String xnid,String edu103Id,String edu105,Long edu106Id,String courseName);

    //根据专业、年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID in (select EDU107_ID from edu107 where edu103 = ?3 and edu104 = ?1 and edu105 =?4 and edu106 =?5)) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T' and course_name = ?6",nativeQuery = true)
    String countPassByEdu106AndXN2(Long edu104Id,String xnid,String edu103Id,String edu105,Long edu106Id,String courseName);

    //根据专业、年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and xnid = ?2) and IS_CONFIRM = 'T' and course_name = ?3",nativeQuery = true)
    String countAllByEdu107AndXN2(Long edu107Id,String xnid,String courseName);

    //根据专业、年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in (select edu201_id from edu201 where EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and xnid = ?2) and IS_CONFIRM = 'T' and IS_PASSED = 'T' and course_name = ?3",nativeQuery = true)
    String countPassByEdu107AndXN2(Long edu107Id,String xnid,String courseName);

    //根据专业、年级、学院和学年查询成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in ?1 and IS_CONFIRM = 'T' and course_name = ?2",nativeQuery = true)
    String countAllByEdu201AndXN2(List<String> edu201ids,String courseName);

    //根据专业、年级、学院和学年查询通过成绩总数
    @Query(value = "select to_char(count(0)) from edu005 t where edu201_id in ?1 and IS_CONFIRM = 'T' and IS_PASSED = 'T' and course_name = ?2",nativeQuery = true)
    String countPassByEdu201AndXN2(List<String> edu201ids,String courseName);

    @Query(value = "select count(0) from (select count(0) num  from edu005 where CLASS_NAME = ?1 and (IS_PASSED = 'F' or IS_PASSED is null) GROUP BY STUDENT_CODE) where num <= ?2",nativeQuery = true)
    String searchGraduationRate(String class_name,String num);

    @Query(value = "select * from edu005 where course_name = ?1 and class_name in ?2 and xnid = ?3 order by student_code",nativeQuery = true)
    List<Edu005> exportGradeByClassIdAndcourseName(String courseName,List<String> className,String xnid);

    @Query(value = "select count(*) from (select count(STUDENT_CODE) from edu005 where EDU300_ID in (select EDU300_ID from edu300 where zybm = ?1 and njbm = ?2) and IS_CONFIRM = 'T' and xnid = ?4 and GRADE < 60 GROUP BY STUDENT_CODE HAVING count(STUDENT_CODE) = ?3)",nativeQuery = true)
    String findNoPassPeopleNum(String zybm,String njbm,String nopass,String xnid);

    @Query(value = "select count(*) from (select count(STUDENT_CODE) from edu005 where EDU300_ID in (select EDU300_ID from edu300 where zybm = ?1 and njbm = ?2) and IS_CONFIRM = 'T' and xnid = ?4 and GRADE < 60 GROUP BY STUDENT_CODE HAVING count(STUDENT_CODE) >= ?3)",nativeQuery = true)
    String findNoPassPeopleNum2(String zybm,String njbm,String nopass,String xnid);

    @Query(value = "select COUNT(*) from edu005 where EDU300_ID in (select EDU300_ID from edu300 where zybm = ?1 and njbm = ?2) and xnid = ?3 and IS_CONFIRM = 'T'",nativeQuery = true)
    String findGradeListNum(String zybm,String njbm,String xnid);
}

