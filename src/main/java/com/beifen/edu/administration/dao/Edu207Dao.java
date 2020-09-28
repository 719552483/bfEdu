package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu207;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Configuration
public interface Edu207Dao extends JpaRepository<Edu207, Long>, JpaSpecificationExecutor<Edu207> {

    //根据排课ID删除关联
    @Transactional
    @Modifying
    @Query(value = "delete from edu207 where Edu201_ID =?1", nativeQuery = true)
    void deleteByscheduleId(String edu201Id);

    //根据edu201ID查询分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID = ?1", nativeQuery = true)
    List<Edu207> findAllByEdu201Id(String edu201Id);

    //根据edu201ID集合查询分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID in ?1 and e.week = ?2", nativeQuery = true)
    List<Edu207> findAllByEdu201Ids(List<String> edu201Ids,String week);

    //根据edu201ID集合查询学年分散学识安排
    @Query(value = "select e.* from Edu207 e where e.edu201_ID in ?1", nativeQuery = true)
    List<Edu207> findAllByEdu201IdsWithoutWeek(List<String> edu201Ids);
}
