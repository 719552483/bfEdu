package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu206;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu206Dao extends JpaRepository<Edu206, Long>, JpaSpecificationExecutor<Edu206> {

    //根据权限和发布标志获教学任务书ID
    @Query(value = "select a.* from edu206 a,edu108 b,edu107 c " +
            "where a.EDU108_ID = b.EDU108_ID " +
            "and b.EDU107_ID = c.EDU107_ID " +
            "and c.EDU104 in ?1 ", nativeQuery = true)
    List<Edu206> findTaskIdByDepartments(List<String> departments);


    // 根据edu108id删除年级
    @Transactional
    @Modifying
    @Query(value = "delete from edu206 where Edu108_ID =?1", nativeQuery = true)
    void deleteByedu108(String edu108ID);

    @Query(value = "select * from edu206 where xnid is not null and EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1)", nativeQuery = true)
    List<Edu206> findTaskByEdu107Id(String edu107Id);


    @Query(value = "select * from edu206 where xnid is not null and EDU108_ID in (select EDU108_ID from edu108 where EDU107_ID = ?1) and kcmc not in (select kcmc from edu201 where edu201_id in (select edu201_id from edu204 where EDU300_ID = ?2))", nativeQuery = true)
    List<Edu206> notPuted(String edu107Id,String edu300id);
}
