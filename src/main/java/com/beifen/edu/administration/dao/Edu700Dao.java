package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu700;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu700Dao extends JpaRepository<Edu700, Long>, JpaSpecificationExecutor<Edu700> {

    //根据id集合删除通知
    @Transactional
    @Modifying
    @Query(value = "delete from edu700 e where e.edu700_ID = ?1 ",nativeQuery = true)
    void deleteByIds(List<String> removeIds);

    //查询学生通知
    @Query(value = "select e.* from Edu700 e where e.notice_type in ('01','03') and e.Edu104_ID in ?1",nativeQuery = true)
    List<Edu700> getNoticesForStudent(List<String> departments);

    //查询老师通知
    @Query(value = "select e.* from Edu700 e where e.notice_type in ('01','02') and e.Edu104_ID in ?1 or e.Edu101_ID = ?2",nativeQuery = true)
    List<Edu700> getNoticesForTeacher(List<String> departments,String userId);


    //获取用户发布的通知
    @Query(value = "select select e.* from Edu700 e where e.edu101_ID = ?1",nativeQuery = true)
    List<Edu700> getNoticesByUserId(String userId);
}
